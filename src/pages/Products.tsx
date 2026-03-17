import { useMemo } from 'react';
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/stores/cartStore';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import type { Product } from '@/types';

function DenominationCard({ product }: { product: Product }) {
  const { items, addItem, updateQuantity } = useCartStore();
  const cartItem = items.find((item) => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addItem(product);
    toast.success(`已加入購物車：${product.name}【${product.denomination.toLocaleString()}點】`);
  };

  return (
    <div className="card group flex flex-col items-center overflow-hidden p-4 text-center transition-all hover:border-primary/50 hover:shadow-[0_0_20px_rgba(0,229,255,0.1)]">
      {/* Card image */}
      <div className="relative mb-3 h-28 w-36 overflow-hidden rounded-lg bg-gradient-to-br from-amber-900/40 to-amber-800/20 p-2">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={`${product.name}【${product.denomination.toLocaleString()}點】`}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <ShoppingCart className="mb-1 h-8 w-8 text-primary" />
            <span className="text-lg font-bold text-primary">
              {product.denomination.toLocaleString()}
            </span>
          </div>
        )}
        {/* Denomination badge */}
        <div className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-xs font-bold text-primary">
          TWD {product.denomination.toLocaleString()}
        </div>
        {/* In-cart indicator */}
        {quantity > 0 && (
          <div className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
            <Check className="h-3 w-3 text-bg-dark" />
          </div>
        )}
      </div>

      {/* Name */}
      <h3 className="text-sm font-semibold text-text-primary">
        {product.name}【{product.denomination.toLocaleString()}點】
      </h3>

      {/* Price */}
      <p className="mt-2 text-lg font-bold text-amber-400">
        NT$ {product.denomination.toLocaleString()}
      </p>

      {/* Cart controls */}
      {quantity > 0 ? (
        <div className="mt-3 flex w-full items-center justify-center gap-2">
          <button
            onClick={() => updateQuantity(product.id, quantity - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-default bg-bg-surface text-text-secondary hover:border-primary hover:text-primary transition-colors"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-8 text-center text-sm font-bold text-text-primary">{quantity}</span>
          <button
            onClick={() => {
              updateQuantity(product.id, quantity + 1);
              toast.success('數量已更新');
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-default bg-bg-surface text-text-secondary hover:border-primary hover:text-primary transition-colors"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          className="btn-primary mt-3 flex w-full items-center justify-center gap-1.5 py-2 text-sm"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          加入購物車
        </button>
      )}
    </div>
  );
}

export default function Products() {
  const { data: products, isLoading } = useProducts(true);

  // Group products by category
  const grouped = useMemo(() => {
    if (!products) return [];
    const map = new Map<string, Product[]>();
    for (const p of products) {
      const cat = p.category || '其他';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(p);
    }
    return Array.from(map.entries());
  }, [products]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold text-text-primary">商品列表</h1>
      <p className="mt-2 text-text-muted">瀏覽所有遊戲點數卡，選擇面額後即可購買</p>

      {/* Products */}
      <div className="mt-8">
        {isLoading ? (
          <LoadingSpinner />
        ) : grouped.length > 0 ? (
          grouped.map(([category, items]) => (
            <section key={category} className="mb-12">
              {/* Category title */}
              <div className="mb-4 flex items-center gap-2">
                <div className="h-6 w-1 rounded-full bg-primary" />
                <h3 className="text-lg font-bold text-primary">{category}</h3>
                <span className="text-sm text-text-muted">（共 {items.length} 種面額）</span>
              </div>

              {/* Denomination grid */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {items.map((product) => (
                  <DenominationCard key={product.id} product={product} />
                ))}
              </div>
            </section>
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
