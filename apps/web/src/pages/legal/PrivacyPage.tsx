/**
 * DuitDiary - Kebijakan Privasi
 */

import { Link } from 'react-router-dom';
import { AuthLayout, PageTransition } from '@/components/layout';
import { ROUTES } from '@/lib/constants';

export function PrivacyPage() {
  return (
    <PageTransition>
      <AuthLayout title="Kebijakan Privasi" subtitle="Bagaimana kami menangani data Anda">
        <div className="max-h-[70vh] space-y-4 overflow-y-auto text-sm leading-relaxed text-muted">
          <p>
            DuitDiary menyimpan data akun (nama, email, preferensi) dan data keuangan yang Anda
            catat (transaksi, kategori, unggahan struk/avatar) untuk menyediakan fitur aplikasi.
          </p>
          <p>
            Data digunakan untuk autentikasi, sinkronisasi antar perangkat, dan menampilkan
            ringkasan dashboard. Kami tidak menjual data pribadi Anda kepada pihak ketiga untuk
            iklan.
          </p>
          <p>
            Unggahan (struk, avatar) dilindungi di server dan hanya dapat diakses oleh akun yang
            berwenang. Anda dapat meminta penghapusan akun dengan menghubungi pengelola layanan.
          </p>
          <p>
            Keamanan: password di-hash; sesi memakai token yang dapat dibatalkan. Tetap gunakan
            password yang kuat dan jangan bagikan tautan reset password.
          </p>
          <p className="text-xs text-muted">Terakhir diperbarui: Agustus 2026</p>
        </div>
        <p className="mt-4 text-center text-sm">
          <Link to={ROUTES.REGISTER} className="font-semibold text-accent hover:underline">
            Kembali ke pendaftaran
          </Link>
        </p>
      </AuthLayout>
    </PageTransition>
  );
}
