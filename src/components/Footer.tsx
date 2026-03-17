import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border-default bg-bg-dark">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <span className="text-xl font-bold tracking-wider text-primary">名將數位</span>
            <p className="mt-3 text-sm text-text-muted">
              安全、快速的遊戲點數卡購買平台
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-secondary">
              快速連結
            </h3>
            <div className="flex flex-col gap-2">
              <Link to="/products" className="text-sm text-text-muted hover:text-primary">
                商品列表
              </Link>
              <Link to="/contact" className="text-sm text-text-muted hover:text-primary">
                聯絡我們
              </Link>
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-secondary">
              關於我們
            </h3>
            <p className="text-sm text-text-muted">
              名將數位科技有限公司
            </p>
            <p className="mt-1 text-sm text-text-muted">
              提供最安全可靠的遊戲點數卡服務
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-border-default pt-8 text-center text-sm text-text-muted">
          © {new Date().getFullYear()} 名將數位科技有限公司. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
