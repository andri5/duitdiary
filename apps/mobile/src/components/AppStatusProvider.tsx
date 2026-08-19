import { useEffect, useState, type ReactNode } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { subscribeAppStatus, emitAppStatus, resetAppStatusDedup } from '../lib/appStatus';
import { flushOfflineQueue } from '../lib/offlineQueue';
import { FancyDialog } from './AppDialog';

export function AppStatusProvider({ children }: { children: ReactNode }) {
  const [offlineOpen, setOfflineOpen] = useState(false);
  const [maintOpen, setMaintOpen] = useState(false);
  const [offlineMsg, setOfflineMsg] = useState<string | undefined>();
  const [maintMsg, setMaintMsg] = useState<string | undefined>();

  useEffect(() => {
    const unsub = subscribeAppStatus((event) => {
      if (event.type === 'offline') {
        setOfflineMsg(event.message);
        setOfflineOpen(true);
      }
      if (event.type === 'maintenance') {
        setMaintMsg(event.message);
        setMaintOpen(true);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      if (state.isConnected === false) {
        emitAppStatus({
          type: 'offline',
          message: 'Koneksi terputus. Periksa internet lalu coba lagi.',
        });
      } else if (state.isConnected === true && state.isInternetReachable !== false) {
        resetAppStatusDedup();
        void flushOfflineQueue();
      }
    });
    return () => unsub();
  }, []);

  return (
    <>
      {children}
      <FancyDialog
        visible={offlineOpen}
        variant="offline"
        title="Tidak ada internet"
        message={
          offlineMsg || 'Periksa koneksi Wi‑Fi atau data seluler, lalu coba lagi.'
        }
        confirmLabel="Coba lagi"
        cancelLabel="Mengerti"
        showCancel
        onConfirm={() => {
          void NetInfo.fetch().then((s) => {
            if (s.isConnected === false) {
              emitAppStatus({ type: 'offline' });
            }
          });
        }}
        onRequestClose={() => setOfflineOpen(false)}
      />
      <FancyDialog
        visible={maintOpen}
        variant="maintenance"
        title="Sedang maintenance"
        message={
          maintMsg ||
          'DuitDiary sementara dalam perawatan. Data kamu aman — silakan coba beberapa saat lagi.'
        }
        confirmLabel="Coba lagi"
        cancelLabel="Mengerti"
        showCancel
        onRequestClose={() => setMaintOpen(false)}
      />
    </>
  );
}
