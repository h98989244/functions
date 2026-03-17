import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronDown, ChevronUp, ExternalLink, ShoppingCart } from 'lucide-react';
import { useProduct } from '@/hooks/useProducts';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useProduct(slug || '');
  const [selectedDenom, setSelectedDenom] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showNotice, setShowNotice] = useState(false);

  if (isLoading) return <LoadingSpinner />;
  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-lg text-text-muted">找不到此商品</p>
        <Link to="/products" className="mt-4 inline-block text-primary hover:underline">
          返回商品列表
        </Link>
      </div>
    );
  }

  const images = product.images || [];
  const currentImage = images[selectedImage];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link
        to="/products"
        className="mb-6 inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" /> 返回商品列表
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div>
          <div className="aspect-[4/3] overflow-hidden rounded-xl border border-border-default bg-bg-surface">
            {currentImage ? (
              <img src={currentImage} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center">
                <ShoppingCart className="h-16 w-16 text-text-muted" />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${
                    selectedImage === i ? 'border-primary' : 'border-border-default'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.category && (
            <span className="mb-2 inline-block rounded bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {product.category}
            </span>
          )}
          <h1 className="text-3xl font-bold text-text-primary">{product.name}</h1>
          {product.short_desc && (
            <p className="mt-2 text-text-secondary">{product.short_desc}</p>
          )}

          {product.description && (
            <div className="prose prose-invert mt-4 max-w-none text-sm text-text-secondary">
              <p className="whitespace-pre-wrap">{product.description}</p>
            </div>
          )}

          {/* Denominations */}
          {product.denominations && product.denominations.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold text-text-secondary">選擇面額</h3>
              <div className="flex flex-wrap gap-2">
                {product.denominations.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDenom(d)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                      selectedDenom === d
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border-default text-text-secondary hover:border-primary/50'
                    }`}
                  >
                    ${d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Buy button */}
          {product.buy_url && (
            <a
              href={product.buy_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-8 inline-flex items-center gap-2 px-8 py-3 text-lg"
            >
              前往購買 <ExternalLink className="h-5 w-5" />
            </a>
          )}

          {/* Collapsible sections */}
          <div className="mt-8 space-y-3">
            {product.instructions && (
              <div className="rounded-lg border border-border-default">
                <button
                  onClick={() => setShowInstructions(!showInstructions)}
                  className="flex w-full items-center justify-between p-4 text-sm font-medium text-text-primary"
                >
                  使用說明
                  {showInstructions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {showInstructions && (
                  <div className="border-t border-border-default p-4 text-sm text-text-secondary whitespace-pre-wrap">
                    {product.instructions}
                  </div>
                )}
              </div>
            )}
            {product.notice && (
              <div className="rounded-lg border border-border-default">
                <button
                  onClick={() => setShowNotice(!showNotice)}
                  className="flex w-full items-center justify-between p-4 text-sm font-medium text-text-primary"
                >
                  注意事項
                  {showNotice ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {showNotice && (
                  <div className="border-t border-border-default p-4 text-sm text-text-secondary whitespace-pre-wrap">
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
