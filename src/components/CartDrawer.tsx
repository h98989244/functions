import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, removeItem, updateQuantity, getTotal, getItemCount } =
    useCartStore();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const total = getTotal();
  const itemCount = getItemCount();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-border-default bg-bg-dark shadow-2xl animate-[slideInRight_0.3s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-default px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-text-primary">購物車</h2>
            {itemCount > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {itemCount} 件
              </span>
            )}
          </div>
          <button
            onClick={closeDrawer}
            className="rounded-lg p-1.5 text-text-muted hover:bg-bg-surface hover:text-text-primary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-text-muted">
              <ShoppingCart className="mb-4 h-16 w-16 opacity-30" />
              <p className="text-lg font-medium">購物車是空的</p>
              <p className="mt-1 text-sm">快去挑選喜歡的商品吧！</p>
              <Link
                to="/products"
                onClick={closeDrawer}
                className="btn-primary mt-6 inline-flex items-center gap-2 px-6 py-2"
              >
                前往商品列表
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 rounded-xl border border-border-default bg-bg-card p-4"
                >
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
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary">
                        {item.product.name}【{item.product.price.toLocaleString()}點】
                      </h3>
                      <p className="mt-0.5 text-sm font-bold text-amber-400">
                        NT$ {item.product.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-border-default bg-bg-surface text-text-secondary hover:border-primary hover:text-primary transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-text-primary">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-border-default bg-bg-surface text-text-secondary hover:border-primary hover:text-primary transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-text-primary">
                          NT$ {(item.product.price * item.quantity).toLocaleString()}
                        </span>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="rounded p-1 text-text-muted hover:text-danger transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border-default px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">共 {itemCount} 件商品</span>
              <div className="text-right">
                <p className="text-sm text-text-muted">合計</p>
                <p className="text-2xl font-bold text-primary">
                  NT$ {total.toLocaleString()}
                </p>
              </div>
            </div>
            <Link
              to="/checkout"
              onClick={closeDrawer}
              className="btn-primary block w-full py-3 text-center text-base font-semibold"
            >
              前往結帳
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
