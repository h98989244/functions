import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ShoppingCart, Trash2, CreditCard, Lock } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

const checkoutSchema = z.object({
  name: z.string().min(1, '請輸入姓名'),
  email: z.string().email('請輸入有效的 Email'),
  phone: z.string().min(9, '請輸入有效的電話號碼'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { items, removeItem, getTotal, getItemCount, clearCart } = useCartStore();
  const total = getTotal();
  const itemCount = getItemCount();

  const {
    register,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
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
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link
        to="/products"
        className="mb-6 inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" /> 繼續購物
      </Link>

      <h1 className="mb-8 text-3xl font-bold text-text-primary">結帳</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: Order items + contact form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order items */}
          <div className="card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-text-primary">
              <ShoppingCart className="h-5 w-5 text-primary" />
              訂單明細
              <span className="text-sm font-normal text-text-muted">（{itemCount} 件）</span>
            </h2>

            <div className="divide-y divide-border-default">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-4 py-4">
                  {/* Image */}
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-bg-surface">
                    {item.product.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ShoppingCart className="h-5 w-5 text-text-muted" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-text-primary">
                      {item.product.name}【{item.product.denomination.toLocaleString()}點】
                    </h3>
                    <p className="text-xs text-text-muted">
                      NT$ {item.product.denomination.toLocaleString()} x {item.quantity}
                    </p>
                  </div>

                  {/* Price + delete */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-amber-400">
                      NT$ {(item.product.denomination * item.quantity).toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="rounded p-1 text-text-muted hover:text-danger transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={clearCart}
              className="mt-4 text-xs text-text-muted hover:text-danger transition-colors"
            >
              清空購物車
            </button>
          </div>

          {/* Contact form */}
          <div className="card p-6">
            <h2 className="mb-4 text-lg font-bold text-text-primary">聯絡資訊</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">
                  姓名 *
                </label>
                <input
                  {...register('name')}
                  className="input-field"
                  placeholder="請輸入您的姓名"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-danger">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">
                  Email *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="input-field"
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-danger">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">
                  電話 *
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="input-field"
                  placeholder="0912-345-678"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-danger">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div>
          <div className="card sticky top-20 p-6">
            <h2 className="mb-4 text-lg font-bold text-text-primary">訂單摘要</h2>

            <div className="space-y-3 border-b border-border-default pb-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-text-secondary">
                    {item.product.name}【{item.product.denomination.toLocaleString()}點】x{item.quantity}
                  </span>
                  <span className="text-text-primary">
                    NT$ {(item.product.denomination * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-semibold text-text-primary">合計</span>
              <span className="text-2xl font-bold text-primary">
                NT$ {total.toLocaleString()}
              </span>
            </div>

            {/* Payment section - placeholder */}
            <div className="mt-6 rounded-lg border border-border-default bg-bg-surface/50 p-4">
              <div className="flex items-center gap-2 text-text-muted">
                <CreditCard className="h-5 w-5" />
                <span className="text-sm font-medium">付款方式</span>
              </div>
              <p className="mt-2 text-xs text-text-muted">
                金流串接即將開放，敬請期待！
              </p>
            </div>

            {/* Submit button - disabled */}
            <button
              disabled
              className="mt-4 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-text-muted/20 py-3 text-base font-semibold text-text-muted"
            >
              <Lock className="h-4 w-4" />
              確認訂單（即將開放）
            </button>

            <p className="mt-3 flex items-center justify-center gap-1 text-xs text-text-muted">
              <Lock className="h-3 w-3" />
              所有交易皆受到 SSL 加密保護
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
