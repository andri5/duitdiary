/**
 * Market quotes — USD/IDR + gold (Antam 1g)
 * Cached in-memory to avoid hammering upstream APIs.
 */

type UsdQuote = {
  rate: number;
  updatedAt: string;
  source: string;
};

type GoldQuote = {
  sellPerGram: number;
  buybackPerGram: number;
  label: string;
  updatedAt: string;
  source: string;
};

export type MarketQuotes = {
  usdIdr: UsdQuote;
  gold: GoldQuote;
  fetchedAt: string;
};

type CacheEntry = {
  data: MarketQuotes;
  expiresAt: number;
};

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const USD_URL = 'https://open.er-api.com/v6/latest/USD';
const GOLD_URL = 'https://logam-mulia-api.iamutaki.workers.dev/api/prices/anekalogam';

let cache: CacheEntry | null = null;

type GoldRow = {
  material?: string;
  materialType?: string;
  weight?: number;
  sellPrice?: number;
  buybackPrice?: number;
  recordedDate?: string;
  displayName?: string;
};

function pickAntamOneGram(rows: GoldRow[]): GoldRow | null {
  const oneGram = rows.filter(
    (row) =>
      row.material === 'gold' &&
      row.weight === 1 &&
      typeof row.sellPrice === 'number' &&
      typeof row.buybackPrice === 'number'
  );

  if (!oneGram.length) return null;

  const preferred =
    oneGram.find(
      (row) =>
        /antam/i.test(row.materialType || '') &&
        !/100\s*gram/i.test(row.materialType || '')
    ) || oneGram[0];

  return preferred;
}

async function fetchUsdIdr(): Promise<UsdQuote> {
  const response = await fetch(USD_URL);
  if (!response.ok) {
    throw new Error(`USD rate upstream failed (${response.status})`);
  }

  const json = (await response.json()) as {
    result?: string;
    rates?: { IDR?: number };
    time_last_update_utc?: string;
    provider?: string;
  };

  const rate = json.rates?.IDR;
  if (!rate || !Number.isFinite(rate)) {
    throw new Error('USD/IDR rate missing from upstream');
  }

  return {
    rate: Math.round(rate * 100) / 100,
    updatedAt: json.time_last_update_utc || new Date().toISOString(),
    source: 'ExchangeRate-API',
  };
}

async function fetchGold(): Promise<GoldQuote> {
  const response = await fetch(GOLD_URL);
  if (!response.ok) {
    throw new Error(`Gold price upstream failed (${response.status})`);
  }

  const json = (await response.json()) as {
    success?: boolean;
    data?: GoldRow[];
    timestamp?: string;
  };

  if (!json.success || !Array.isArray(json.data)) {
    throw new Error('Gold price payload invalid');
  }

  const row = pickAntamOneGram(json.data);
  if (!row?.sellPrice || !row.buybackPrice) {
    throw new Error('Antam 1g price not found');
  }

  return {
    sellPerGram: row.sellPrice,
    buybackPerGram: row.buybackPrice,
    label: 'Antam 1 gram',
    updatedAt: row.recordedDate || json.timestamp || new Date().toISOString(),
    source: row.displayName || 'Aneka Logam',
  };
}

export class MarketService {
  async getQuotes(): Promise<MarketQuotes> {
    if (cache && Date.now() < cache.expiresAt) {
      return cache.data;
    }

    const [usdIdr, gold] = await Promise.all([fetchUsdIdr(), fetchGold()]);
    const data: MarketQuotes = {
      usdIdr,
      gold,
      fetchedAt: new Date().toISOString(),
    };

    cache = { data, expiresAt: Date.now() + CACHE_TTL_MS };
    return data;
  }
}

export const marketService = new MarketService();
