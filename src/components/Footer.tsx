import { Link } from 'react-router-dom';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export default function Footer() {
  const { data: settings } = useSiteSettings();

  return (
    <footer className="border-t border-border-default bg-bg-dark">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="名將數位" className="h-8 w-8" />
              <span className="text-xl font-bold tracking-wider text-primary">名將數位</span>
            </div>
            <p className="mt-3 text-sm text-text-muted">
              安全、快速的遊戲點數卡購買平台
            </p>
            {settings?.tax_id && (
              <p className="mt-2 text-xs text-text-muted">統一編號：{settings.tax_id}</p>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-secondary">
              快速連結
            </h3>
            <div className="flex flex-col gap-2">
              <Link to="/products" className="text-sm text-text-muted hover:text-primary">商品列表</Link>
              <Link to="/about" className="text-sm text-text-muted hover:text-primary">關於我們</Link>
              <Link to="/faq" className="text-sm text-text-muted hover:text-primary">常見問題</Link>
              <Link to="/contact" className="text-sm text-text-muted hover:text-primary">聯絡我們</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-secondary">
              法律資訊
            </h3>
            <div className="flex flex-col gap-2">
              <Link to="/terms" className="text-sm text-text-muted hover:text-primary">服務條款</Link>
              <Link to="/privacy" className="text-sm text-text-muted hover:text-primary">隱私權政策</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-secondary">
              聯絡資訊
            </h3>
            <div className="flex flex-col gap-2 text-sm text-text-muted">
              {settings?.contact_email && (
                <a href={`mailto:${settings.contact_email}`} className="hover:text-primary">{settings.contact_email}</a>
              )}
              {settings?.contact_phone && (
                <a href={`tel:${settings.contact_phone}`} className="hover:text-primary">{settings.contact_phone}</a>
              )}
              <p>名將數位科技有限公司</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border-default pt-8 text-center text-sm text-text-muted">
          © {new Date().getFullYear()} 名將數位科技有限公司. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
