import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.slug}`} className="card group overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-bg-surface">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ShoppingCart className="h-12 w-12 text-text-muted" />
          </div>
        )}
        {product.is_featured && (
          <span className="absolute left-3 top-3 rounded bg-secondary px-2 py-0.5 text-xs font-bold text-white">
            精選
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors">
          {product.name}【{product.price.toLocaleString()}點】
        </h3>
        {product.short_desc && (
          <p className="mt-1 text-sm text-text-muted line-clamp-2">{product.short_desc}</p>
        )}

        <p className="mt-2 text-lg font-bold text-amber-400">
          NT$ {product.price.toLocaleString()}
        </p>

        <div className="mt-4">
          <span className="btn-primary inline-block text-sm">查看詳情</span>
        </div>
      </div>
    </Link>
  );
}
