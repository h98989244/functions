import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ShoppingCart, CreditCard, Lock, Building2, Store, CheckCircle2, Loader2 } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { supabase } from '@/lib/supabase';

const checkoutSchema = z.object({
  email: z.string().email('請輸入有效的 Email'),
  phone: z.string().optional(),
  payment_method: z.enum(['atm', 'cvs'], { message: '請選擇付款方式' }),
  agree_terms: z.literal(true, { message: '請同意購買條款與隱私權政策' }),
  agree_no_refund: z.literal(true, { message: '請確認了解不可退換' }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

function generateOrderNumber() {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `MJ${y}${m}${d}${rand}`;
}

export default function Checkout() {
  const { items, getTotal, getItemCount, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{ orderNumber: string; email: string } | null>(null);

  const subtotal = getTotal();
  const itemCount = getItemCount();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      payment_method: 'atm',
    },
  });

  const paymentMethod = watch('payment_method');

  // Fee calculation
  const fee = paymentMethod === 'cvs' ? Math.ceil(subtotal * 0.03) : 0;
  const total = subtotal + fee;

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) return;
    setIsSubmitting(true);

    try {
      const orderNumber = generateOrderNumber();

      // Insert order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          email: data.email,
          phone: data.phone || null,
          payment_method: data.payment_method,
          status: 'pending',
          subtotal,
          fee,
          total,
        })
        .select('id')
        .single();

      if (orderError) throw orderError;

      // Insert order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        denomination: item.product.denomination,
        quantity: item.quantity,
        subtotal: item.product.denomination * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Success
      clearCart();
      setOrderSuccess({ orderNumber, email: data.email });
    } catch (err) {
      console.error('Order creation failed:', err);
      alert('訂單建立失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order success page
  if (orderSuccess) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-20 w-20 text-green-500" />
        <h1 className="text-3xl font-bold text-text-primary">訂單已成立！</h1>
        <p className="mt-3 text-text-secondary">
          訂單編號：<span className="font-mono font-bold text-primary">{orderSuccess.orderNumber}</span>
        </p>
        <p className="mt-2 text-sm text-text-muted">
          付款資訊已發送至 <span className="text-primary">{orderSuccess.email}</span>
        </p>

        <div className="mt-8 rounded-xl border border-border-default bg-bg-card p-6 text-left">
          <h2 className="mb-3 font-bold text-text-primary">下一步</h2>
          <ol className="list-inside list-decimal space-y-2 text-sm text-text-secondary">
            <li>請依照 Email 中的付款資訊完成付款</li>
            <li>付款完成後，序號將自動發送至您的信箱</li>
            <li>如有問題請聯繫客服</li>
          </ol>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link to="/products" className="btn-primary px-8 py-3">
            繼續購物
          </Link>
          <Link
            to="/"
            className="rounded-xl border border-border-default px-8 py-3 text-sm font-medium text-text-secondary hover:border-primary hover:text-primary transition-colors"
          >
            回首頁
          </Link>
        </div>
      </div>
    );
  }

  // Empty cart
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
        to="/cart"
        className="mb-6 inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> 返回購物車
      </Link>

      <h1 className="mb-8 text-3xl font-bold text-text-primary">結帳</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: Contact + Payment + Agreement */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact info */}
            <div className="card p-6">
              <h2 className="mb-4 text-lg font-bold text-text-primary">聯絡資訊</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-secondary">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="input-field"
                    placeholder="example@email.com"
                  />
                  <p className="mt-1 text-xs text-text-muted">序號將發送到此 Email</p>
                  {errors.email && (
                    <p className="mt-1 text-xs text-danger">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-secondary">
                    電話 <span className="text-xs text-text-muted">（選填）</span>
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className="input-field"
                    placeholder="0912-345-678"
                  />
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-text-primary">
                <CreditCard className="h-5 w-5 text-primary" />
                付款方式
              </h2>
              {errors.payment_method && (
                <p className="mb-3 text-xs text-danger">{errors.payment_method.message}</p>
              )}
              <div className="space-y-3">
                {/* ATM */}
                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${
                    paymentMethod === 'atm'
                      ? 'border-primary bg-primary/5'
                      : 'border-border-default hover:border-primary/50'
                  }`}
                >
                  <input
                    {...register('payment_method')}
                    type="radio"
                    value="atm"
                    className="h-4 w-4 accent-[var(--color-primary)]"
                  />
                  <Building2 className="h-6 w-6 text-primary" />
                  <div className="flex-1">
                    <div className="font-semibold text-text-primary">ATM 轉帳</div>
                    <div className="text-xs text-text-muted">較低手續費，銀行 ATM 或網銀轉帳</div>
                  </div>
                  <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                    免手續費
                  </span>
                </label>

                {/* CVS */}
                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${
                    paymentMethod === 'cvs'
                      ? 'border-primary bg-primary/5'
                      : 'border-border-default hover:border-primary/50'
                  }`}
                >
                  <input
                    {...register('payment_method')}
                    type="radio"
                    value="cvs"
                    className="h-4 w-4 accent-[var(--color-primary)]"
                  />
                  <Store className="h-6 w-6 text-primary" />
                  <div className="flex-1">
                    <div className="font-semibold text-text-primary">超商代碼</div>
                    <div className="text-xs text-text-muted">7-11 / 全家 / OK / 萊爾富</div>
                  </div>
                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
                    +3% 手續費
                  </span>
                </label>
              </div>
            </div>

            {/* Agreement */}
            <div className="card p-6">
              <h2 className="mb-4 text-lg font-bold text-text-primary">確認事項</h2>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    {...register('agree_terms')}
                    type="checkbox"
                    className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-primary)]"
                  />
                  <span className="text-sm text-text-secondary">
                    我已閱讀並同意{' '}
                    <Link to="/terms" className="text-primary hover:underline" target="_blank">
                      購買條款
                    </Link>
                    {' '}與{' '}
                    <Link to="/privacy" className="text-primary hover:underline" target="_blank">
                      隱私權政策
                    </Link>
                  </span>
                </label>
                {errors.agree_terms && (
                  <p className="ml-7 text-xs text-danger">{errors.agree_terms.message}</p>
                )}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    {...register('agree_no_refund')}
                    type="checkbox"
                    className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-primary)]"
                  />
                  <span className="text-sm text-text-secondary">
                    我了解點數卡為消耗性商品，發貨後不可退換
                  </span>
                </label>
                {errors.agree_no_refund && (
                  <p className="ml-7 text-xs text-danger">{errors.agree_no_refund.message}</p>
                )}
              </div>
            </div>

            {/* Submit button (mobile) */}
            <div className="lg:hidden">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-bold text-bg-dark transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    處理中...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    確認訂單並付款
                  </>
                )}
              </button>
              <p className="mt-2 flex items-center justify-center gap-1 text-xs text-text-muted">
                <Lock className="h-3 w-3" />
                所有交易皆受到 SSL 加密保護
              </p>
            </div>
          </div>

          {/* Right: Order summary */}
          <div>
            <div className="card sticky top-20 p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-text-primary">
                <ShoppingCart className="h-5 w-5 text-primary" />
                訂單摘要
                <span className="text-sm font-normal text-text-muted">（{itemCount} 件）</span>
              </h2>

              <div className="space-y-3 border-b border-border-default pb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-text-secondary">
                      {item.product.name}【{item.product.denomination.toLocaleString()}點】x{item.quantity}
                    </span>
                    <span className="font-medium text-text-primary">
                      NT$ {(item.product.denomination * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2 border-b border-border-default pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">小計</span>
                  <span className="text-text-primary">NT$ {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">手續費</span>
                  <span className={fee > 0 ? 'text-amber-400' : 'text-green-400'}>
                    {fee > 0 ? `NT$ ${fee.toLocaleString()}` : '免費'}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-semibold text-text-primary">合計</span>
                <span className="text-2xl font-bold text-primary">
                  NT$ {total.toLocaleString()}
                </span>
              </div>

              {/* Submit button (desktop) */}
              <div className="mt-6 hidden lg:block">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-bold text-bg-dark transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      處理中...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      確認訂單並付款
                    </>
                  )}
                </button>
                <p className="mt-3 flex items-center justify-center gap-1 text-xs text-text-muted">
                  <Lock className="h-3 w-3" />
                  所有交易皆受到 SSL 加密保護
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
