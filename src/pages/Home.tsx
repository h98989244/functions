import { Link } from 'react-router-dom';
import { Search, CreditCard, Zap, ShieldAlert, ChevronRight } from 'lucide-react';
import { useFeaturedProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const { data: featured, isLoading } = useFeaturedProducts();

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative w-full overflow-hidden">
        <Link to="/products" className="block">
          <img
            src="/ad.jpg"
            alt="提升您的遊戲體驗 - 即時存取、安全支付、立即充值"
            className="w-full object-cover"
            style={{ maxHeight: '560px' }}
          />
        </Link>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text-primary">
            <span className="text-primary">|</span> 精選商品
          </h2>
          <Link to="/products" className="flex items-center gap-1 text-sm text-text-secondary hover:text-primary">
            查看全部 <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        {isLoading ? (
          <LoadingSpinner />
        ) : featured && featured.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-text-muted">目前沒有精選商品</p>
        )}
      </section>

      {/* How to buy */}
      <section className="border-y border-border-default bg-bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center text-2xl font-bold text-text-primary">
            購買三步驟
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: Search, title: '選擇商品', desc: '瀏覽我們豐富的遊戲點數卡商品，找到您需要的品項' },
              { icon: CreditCard, title: '安全付款', desc: '透過安全的支付管道完成購買，保障您的交易安全' },
              { icon: Zap, title: '即時到帳', desc: '付款完成後點數即時到帳，立即享受遊戲樂趣' },
            ].map((step, i) => (
              <div key={i} className="card p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-text-primary">{step.title}</h3>
                <p className="mt-2 text-sm text-text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Anti-fraud warning */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-start gap-4 rounded-xl border border-warning/30 bg-warning/5 p-6">
          <ShieldAlert className="h-8 w-8 shrink-0 text-warning" />
          <div>
            <h3 className="font-bold text-warning">防詐騙公告</h3>
            <p className="mt-1 text-sm text-text-secondary">
              保護您的帳號安全。切勿將登入資訊或信用卡資料分享給任何人。如發現可疑活動，請立即與我們聯繫。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
