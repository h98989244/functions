import { useState, useMemo } from 'react';
import { Search, ShoppingCart, ChevronDown, ChevronUp, ExternalLink, Info, AlertTriangle } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { Product } from '@/types';

function ProductFullCard({ product }: { product: Product }) {
  const [selectedDenom, setSelectedDenom] = useState<number | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const imageUrl = product.images?.[currentImage] || product.images?.[0];

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Left: Image */}
        <div className="relative w-full lg:w-[400px] shrink-0">
          <div className="aspect-square overflow-hidden bg-bg-surface">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <ShoppingCart className="h-16 w-16 text-text-muted" />
              </div>
            )}
          </div>
          {/* Thumbnail row */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`h-14 w-14 shrink-0 overflow-hidden rounded border-2 transition-all ${
                    currentImage === idx ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
          {product.is_featured && (
            <span className="absolute left-3 top-3 rounded bg-secondary px-3 py-1 text-xs font-bold text-white shadow-lg">
              精選商品
            </span>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
                {product.category || '點數卡'}
              </span>
              <h2 className="mt-2 text-2xl font-bold text-text-primary lg:text-3xl">
                {product.name}
              </h2>
            </div>
          </div>

          {/* Description */}
          {product.short_desc && (
            <p className="mt-3 text-text-secondary leading-relaxed">{product.short_desc}</p>
          )}
          {product.description && (
            <p className="mt-2 text-sm text-text-muted leading-relaxed">{product.description}</p>
          )}

          {/* Denominations */}
          {product.denominations && product.denominations.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-text-secondary mb-3">選擇面額</h3>
              <div className="flex flex-wrap gap-2">
                {product.denominations.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDenom(selectedDenom === d ? null : d)}
                    className={`rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-all ${
                      selectedDenom === d
                        ? 'border-primary bg-primary/10 text-primary shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                        : 'border-border-default bg-bg-surface text-text-secondary hover:border-primary/50 hover:text-primary'
                    }`}
                  >
                    NT$ {d.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Buy Button */}
          <div className="mt-6">
            {product.buy_url ? (
              <a
                href={product.buy_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-base"
              >
                <ExternalLink className="h-4 w-4" />
                {selectedDenom ? `購買 NT$ ${selectedDenom.toLocaleString()}` : '前往購買'}
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-lg bg-text-muted/20 px-8 py-3 text-base text-text-muted cursor-not-allowed">
                購買連結準備中
              </span>
            )}
          </div>

          {/* Collapsible sections */}
          <div className="mt-6 space-y-3">
            {product.instructions && (
              <div className="rounded-lg border border-border-default overflow-hidden">
                <button
                  onClick={() => setShowInstructions(!showInstructions)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-text-secondary hover:bg-bg-surface transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    使用說明
                  </span>
                  {showInstructions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {showInstructions && (
                  <div className="border-t border-border-default px-4 py-3 text-sm text-text-muted whitespace-pre-line leading-relaxed">
                    {product.instructions}
                  </div>
                )}
              </div>
            )}

            {product.notice && (
              <div className="rounded-lg border border-border-default overflow-hidden">
                <button
                  onClick={() => setShowNotice(!showNotice)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-text-secondary hover:bg-bg-surface transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    注意事項
                  </span>
                  {showNotice ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {showNotice && (
                  <div className="border-t border-border-default px-4 py-3 text-sm text-text-muted whitespace-pre-line leading-relaxed">
                    {product.notice}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
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
        {/* Category tabs */}
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

        {/* Search */}
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

      {/* Product list - one card per product */}
      {isLoading ? (
        <LoadingSpinner />
      ) : filtered.length > 0 ? (
        <div className="mt-8 space-y-8">
          {filtered.map((product) => (
            <ProductFullCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center text-text-muted">
          <p className="text-lg">找不到符合條件的商品</p>
        </div>
      )}
    </div>
  );
}
