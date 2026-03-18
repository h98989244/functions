import { Link } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, getTotal, getItemCount } = useCartStore();
  const total = getTotal();
  const itemCount = getItemCount();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-text-muted opacity-30" />
        <h1 className="text-2xl font-bold text-text-primary">購物車是空的</h1>
        <p className="mt-2 text-text-muted">快去挑選喜歡的商品吧！</p>
        <Link to="/products" className="btn-primary mt-6 inline-flex items-center gap-2 px-8 py-3">
          前往商品列表
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-center text-3xl font-bold text-text-primary">購物車</h1>

      <div className="card overflow-hidden">
        {/* Cart items */}
        <div className="divide-y divide-border-default">
          {items.map((item) => (
            <div key={item.product.id} className="flex items-center gap-4 px-6 py-5">
              {/* Image */}
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-bg-surface">
                {item.product.image_url ? (
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-text-muted" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary">
                  {item.product.name}【{item.product.price.toLocaleString()}點】
                </h3>
                {item.product.short_desc && (
                  <p className="mt-0.5 text-xs text-text-muted">{item.product.short_desc}</p>
                )}
              </div>

              {/* Price */}
              <span className="text-lg font-bold text-primary">
                NT$ {item.product.price.toLocaleString()}
              </span>

              {/* Quantity controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-default text-text-secondary hover:border-primary hover:text-primary transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-semibold text-text-primary">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-default text-text-secondary hover:border-primary hover:text-primary transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Delete */}
              <button
                onClick={() => removeItem(item.product.id)}
                className="rounded-lg p-2 text-text-muted hover:text-danger transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border-default px-6 py-5">
          <h2 className="text-xl font-bold text-text-primary">
            總計：<span className="text-primary">NT$ {total.toLocaleString()}</span>
          </h2>

          <div className="flex items-center gap-3">
            <button
              onClick={clearCart}
              className="rounded-xl border border-border-default px-6 py-2.5 text-sm font-medium text-text-secondary hover:border-danger hover:text-danger transition-colors"
            >
              清空購物車
            </button>
            <Link
              to="/checkout"
              className="btn-primary px-8 py-2.5 text-base font-semibold"
            >
              前往結帳
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-text-muted">
        共 {itemCount} 件商品
      </p>
    </div>
  );
}
