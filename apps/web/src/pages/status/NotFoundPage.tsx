/**
 * 404 — Halaman tidak ditemukan
 */

import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui';
import { PageTransition } from '@/components/layout';
import { ROUTES } from '@/lib/constants';
import { StatusPageShell } from './StatusPageShell';

export function NotFoundPage() {
  return (
    <PageTransition>
      <StatusPageShell
        badge="Error 404"
        title="Halaman tidak ditemukan"
        description="Alamat yang kamu buka tidak ada atau sudah dipindahkan. Periksa URL-nya, atau kembali ke dashboard untuk melanjutkan pencatatan."
        icon={<Compass className="h-7 w-7" />}
        actions={
          <>
            <Link to={ROUTES.DASHBOARD}>
              <Button variant="gradient" leftIcon={<LayoutDashboard className="h-4 w-4" />}>
                Ke Dashboard
              </Button>
            </Link>
            <Button
              type="button"
              variant="outline"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => window.history.back()}
            >
              Kembali
            </Button>
          </>
        }
      />
    </PageTransition>
  );
}
