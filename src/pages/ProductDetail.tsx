import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ExternalLink, ShoppingCart } from 'lucide-react';
import { useProduct } from '@/hooks/useProducts';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useProduct(slug || '');

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link
        to="/products"
        className="mb-6 inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" /> 返回商品列表
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="aspect-[4/3] overflow-hidden rounded-xl border border-border-default bg-bg-surface">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ShoppingCart className="h-16 w-16 text-text-muted" />
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
          <h1 className="text-3xl font-bold text-text-primary">
            {product.name}【{product.price.toLocaleString()}點】
          </h1>
          {product.short_desc && (
            <p className="mt-2 text-text-secondary">{product.short_desc}</p>
          )}

          <p className="mt-4 text-3xl font-bold text-amber-400">
            NT$ {product.price.toLocaleString()}
          </p>

          {product.description && (
            <div className="mt-4 text-sm text-text-secondary">
              <p className="whitespace-pre-wrap">{product.description}</p>
            </div>
          )}

          {/* Buy button */}
          {product.buy_url ? (
            <a
              href={product.buy_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-8 inline-flex items-center gap-2 px-8 py-3 text-lg"
            >
              前往購買 <ExternalLink className="h-5 w-5" />
            </a>
          ) : (
            <span className="mt-8 inline-block rounded-lg bg-text-muted/20 px-8 py-3 text-lg text-text-muted cursor-not-allowed">
              購買連結準備中
            </span>
          )}

          {/* Instructions */}
          {product.instructions && (
            <div className="mt-8 rounded-lg border border-border-default p-4">
              <h3 className="mb-2 text-sm font-semibold text-text-primary">使用說明</h3>
              <p className="text-sm text-text-secondary whitespace-pre-wrap">{product.instructions}</p>
            </div>
          )}

          {/* Notice */}
          {product.notice && (
            <div className="mt-3 rounded-lg border border-border-default p-4">
              <h3 className="mb-2 text-sm font-semibold text-text-primary">注意事項</h3>
              <p className="text-sm text-text-secondary whitespace-pre-wrap">{product.notice}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
