import { Mail, Phone, Building2 } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Contact() {
  const { data: settings, isLoading } = useSiteSettings();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-text-primary">聯絡我們</h1>
      <p className="mt-2 text-text-secondary">
        如有任何問題或需要協助，歡迎透過以下方式與我們聯繫。
      </p>

      <div className="mt-8 space-y-4">
        {settings?.contact_email && (
          <div className="card flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-text-muted">電子信箱</p>
              <a href={`mailto:${settings.contact_email}`} className="text-lg text-text-primary hover:text-primary">
                {settings.contact_email}
              </a>
            </div>
          </div>
        )}

        {settings?.contact_phone && (
          <div className="card flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-text-muted">聯絡電話</p>
              <a href={`tel:${settings.contact_phone}`} className="text-lg text-text-primary hover:text-primary">
                {settings.contact_phone}
              </a>
            </div>
          </div>
        )}

        {settings?.tax_id && (
          <div className="card flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-text-muted">統一編號</p>
              <p className="text-lg text-text-primary">{settings.tax_id}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
