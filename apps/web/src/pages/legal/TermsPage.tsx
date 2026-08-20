/**
 * DuitDiary - Syarat & Ketentuan
 */

import { Link } from 'react-router-dom';
import { AuthLayout, PageTransition } from '@/components/layout';
import { SEO } from '@/components/SEO';
import { ROUTES } from '@/lib/constants';

export function TermsPage() {
  return (
    <PageTransition>
      <SEO title="Syarat & Ketentuan" description="Syarat dan ketentuan penggunaan aplikasi DuitDiary." canonical="/terms" />
      <AuthLayout title="Syarat & Ketentuan" subtitle="Ketentuan penggunaan DuitDiary">
        <div className="max-h-[70vh] space-y-4 overflow-y-auto text-sm leading-relaxed text-muted">
          <p>
            Dengan mendaftar dan menggunakan DuitDiary, Anda menyetujui untuk memakai aplikasi
            sebagai catatan keuangan pribadi secara wajar dan sesuai hukum yang berlaku.
          </p>
          <p>
            Anda bertanggung jawab menjaga kerahasiaan akun (email dan password). DuitDiary tidak
            bertanggung jawab atas kerugian akibat kelalaian menjaga kredensial atau penggunaan
            perangkat yang tidak aman.
          </p>
          <p>
            Data transaksi yang Anda masukkan milik Anda. Kami menyediakan layanan penyimpanan dan
            tampilan untuk membantu pengelolaan keuangan pribadi, tanpa jaminan hasil investasi
            atau saran keuangan profesional.
          </p>
          <p>
            Kami dapat memperbarui ketentuan ini dari waktu ke waktu. Penggunaan berkelanjutan
            setelah pembaruan dianggap sebagai persetujuan terhadap ketentuan terbaru.
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
