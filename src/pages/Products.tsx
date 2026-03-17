import { useState, useMemo } from 'react';
import { Search, ShoppingCart, Info, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { Product } from '@/types';

function DenominationCard({ product, denomination }: { product: Product; denomination: number }) {
  const imageUrl = product.images?.[0];
  const buyUrl = product.buy_url || '#';

  return (
    <div className="card group flex flex-col items-center overflow-hidden p-4 text-center transition-all hover:border-primary/50 hover:shadow-[0_0_20px_rgba(0,229,255,0.1)]">
      {/* Card image */}
      <div className="relative mb-3 h-28 w-36 overflow-hidden rounded-lg bg-gradient-to-br from-amber-900/40 to-amber-800/20 p-2">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${product.name}【${denomination.toLocaleString()}點】`}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <ShoppingCart className="mb-1 h-8 w-8 text-primary" />
            <span className="text-lg font-bold text-primary">
              {denomination.toLocaleString()}
            </span>
          </div>
        )}
        {/* Denomination badge */}
        <div className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-xs font-bold text-primary">
          TWD {denomination.toLocaleString()}
        </div>
      </div>

      {/* Name */}
      <h3 className="text-sm font-semibold text-text-primary">
        {product.name}【{denomination.toLocaleString()}點】
      </h3>

      {/* Price */}
      <p className="mt-2 text-lg font-bold text-amber-400">
        NT$ {denomination.toLocaleString()}
      </p>

      {/* Buy button */}
      <a
        href={buyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mt-3 w-full py-2 text-center text-sm"
      >
        立即購買
      </a>
    </div>
  );
}

function ProductSection({ product }: { product: Product }) {
  const [showNotice, setShowNotice] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const imageUrl = product.images?.[0];

  // Sort denominations from high to low like mepay
  const sortedDenominations = useMemo(() => {
    return [...(product.denominations || [])].sort((a, b) => b - a);
  }, [product.denominations]);

  return (
    <section className="mb-12">
      {/* Product header */}
      <div className="card mb-6 overflow-hidden">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start">
          {/* Product image */}
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-bg-surface p-2">
            {imageUrl ? (
              <img src={imageUrl} alt={product.name} className="h-full w-full object-contain" />
            ) : (
              <ShoppingCart className="h-10 w-10 text-text-muted" />
            )}
          </div>

          {/* Product info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">
                自動發貨
              </span>
              {product.is_featured && (
                <span className="rounded bg-secondary/20 px-2 py-0.5 text-xs font-semibold text-secondary">
                  精選商品
                </span>
              )}
            </div>
            <h2 className="mt-2 text-2xl font-bold text-text-primary">{product.name} 點數卡</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-0.5 text-xs text-primary">
                {product.category || '點數卡'}
              </span>
              <span className="rounded-full border border-border-default bg-bg-surface px-3 py-0.5 text-xs text-text-muted">
                點數卡
              </span>
            </div>
            {product.short_desc && (
              <p className="mt-3 text-sm text-text-muted">{product.short_desc}</p>
            )}
          </div>

          {/* Purchase notice */}
          <div className="w-full rounded-lg border border-border-default bg-bg-surface/50 p-4 sm:w-80">
            <h3 className="mb-2 text-sm font-semibold text-text-primary">購買注意事項</h3>
            <ul className="space-y-1 text-xs leading-relaxed text-text-muted">
              <li>・本商品購買後將提供儲值序號（依品項內容包含卡號，MyCard 會加上密碼）。</li>
              <li>・依《消費者保護法》規定，本商品屬「非有形媒介提供之數位內容」，一經發送即不適用七天鑑賞期。</li>
              <li>・序號售出後恕不接受退貨、換貨或取消訂單。請務必確認品項與面額正確再行下單。</li>
              <li>・取得序號後請儘速兌換並妥善保管，若因個人因素導致遺失或遭他人盜用，恕無法提供補發服務。</li>
            </ul>
          </div>
        </div>

        {/* Collapsible sections */}
        <div className="border-t border-border-default">
          {product.instructions && (
            <div className="border-b border-border-default">
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="flex w-full items-center justify-between px-6 py-3 text-left text-sm font-medium text-text-secondary hover:bg-bg-surface/50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  使用說明
                </span>
                {showInstructions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {showInstructions && (
                <div className="px-6 pb-4 text-sm text-text-muted whitespace-pre-line leading-relaxed">
                  {product.instructions}
                </div>
              )}
            </div>
          )}
          {product.notice && (
            <div>
              <button
                onClick={() => setShowNotice(!showNotice)}
                className="flex w-full items-center justify-between px-6 py-3 text-left text-sm font-medium text-text-secondary hover:bg-bg-surface/50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  注意事項
                </span>
                {showNotice ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {showNotice && (
                <div className="px-6 pb-4 text-sm text-text-muted whitespace-pre-line leading-relaxed">
                  {product.notice}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Denomination title */}
      <div className="mb-4 flex items-center gap-2">
        <div className="h-6 w-1 rounded-full bg-primary" />
        <h3 className="text-lg font-bold text-primary">遊戲幣</h3>
        <span className="text-sm text-text-muted">（共 {sortedDenominations.length} 種面額）</span>
      </div>

      {/* Denomination grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {sortedDenominations.map((denom) => (
          <DenominationCard key={denom} product={product} denomination={denom} />
        ))}
      </div>
    </section>
  );
}

export default function Products() {
  const { data: products, isLoading } = useProducts(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('全部');

  const categories = useMemo(() => {
    if (!products) return ['全部'];
    const cats = [...new Set(products.map((p) => p.category).filter(Boolean))] as string[];
    return ['全部', ...cats];
  }, [products]);

  const filtered = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const matchCategory = category === '全部' || p.category === category;
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, category, search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold text-text-primary">商品列表</h1>
      <p className="mt-2 text-text-muted">瀏覽所有遊戲點數卡，選擇面額後即可購買</p>

      {/* Filters */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                category === cat
                  ? 'bg-primary text-bg-dark'
                  : 'bg-bg-card text-text-secondary hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="搜尋商品..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 sm:w-64"
          />
        </div>
      </div>

      {/* Products */}
      <div className="mt-8">
        {isLoading ? (
          <LoadingSpinner />
        ) : filtered.length > 0 ? (
          filtered.map((product) => (
            <ProductSection key={product.id} product={product} />
          ))
        ) : (
          <div className="mt-16 text-center text-text-muted">
            <p className="text-lg">找不到符合條件的商品</p>
          </div>
        )}
      </div>
    </div>
  );
}
