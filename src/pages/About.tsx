import { Link } from 'react-router-dom';
import { Shield, Zap, CreditCard, Headphones, Award, Tag, ChevronRight } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const advantages = [
  {
    icon: Shield,
    title: '正版授權',
    desc: '所有商品均為官方正版授權，品質有保障，讓您安心購買。',
  },
  {
    icon: Zap,
    title: '即時發卡',
    desc: '付款完成後即時發送序號，不需漫長等待，立即享受遊戲樂趣。',
  },
  {
    icon: CreditCard,
    title: '安全交易',
    desc: '採用 SSL 加密技術與第三方支付，保障每一筆交易的安全性。',
  },
  {
    icon: Award,
    title: '多元商品',
    desc: '提供多款熱門遊戲點數卡，涵蓋各大遊戲平台，一站滿足您的需求。',
  },
  {
    icon: Headphones,
    title: '專業客服',
    desc: '專業客服團隊為您服務，遇到問題快速回應、即時解決。',
  },
  {
    icon: Tag,
    title: '優惠價格',
    desc: '提供具競爭力的價格，不定期推出優惠活動，讓您省更多。',
  },
];

export default function About() {
  const { data: settings } = useSiteSettings();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-bg-dark via-bg-surface to-bg-dark py-20">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(0, 229, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(124, 77, 255, 0.1) 0%, transparent 50%)',
        }} />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-3xl font-bold text-text-primary md:text-5xl">
            關於<span className="text-primary">名將數位</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
            名將數位致力於提供最安全、快速的遊戲點數卡購買服務。我們深知玩家對於便利與信賴的需求，因此打造了這個一站式的遊戲儲值平台。
          </p>
        </div>
      </section>

      {/* Our Service */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="mb-6 text-center text-2xl font-bold text-text-primary">
          <span className="text-primary">|</span> 我們的服務
        </h2>
        <div className="card p-8">
          <p className="text-sm leading-relaxed text-text-secondary">
            名將數位專營各類遊戲點數卡、儲值卡之線上販售服務。我們與多家遊戲廠商合作，提供正版授權的遊戲點數商品，涵蓋市面上各大熱門遊戲。無論您是 PC、手機還是主機玩家，都能在這裡找到您需要的儲值方案。
          </p>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            透過自動化的發卡系統，我們確保您在完成付款後能夠即時收到商品。搭配安全的支付系統與專業的客服團隊，為您提供從選購到售後的完整服務體驗。
          </p>
        </div>
      </section>

      {/* Advantages */}
      <section className="border-y border-border-default bg-bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center text-2xl font-bold text-text-primary">
            為什麼選擇我們
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {advantages.map((item, i) => (
              <div key={i} className="card p-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-text-primary">{item.title}</h3>
                <p className="mt-2 text-sm text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="mb-6 text-center text-2xl font-bold text-text-primary">
          <span className="text-primary">|</span> 我們的承諾
        </h2>
        <div className="card p-8">
          <ul className="space-y-4 text-sm leading-relaxed text-text-secondary">
            <li className="flex items-start gap-3">
              <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span><strong className="text-text-primary">100% 正版保證</strong> — 所有商品均為官方授權，如有任何品質問題，我們負責到底。</span>
            </li>
            <li className="flex items-start gap-3">
              <Zap className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span><strong className="text-text-primary">即時到帳</strong> — 付款確認後自動發卡，最快數秒內即可收到序號。</span>
            </li>
            <li className="flex items-start gap-3">
              <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span><strong className="text-text-primary">安全有保障</strong> — 我們不儲存任何付款資訊，所有交易透過加密通道處理。</span>
            </li>
            <li className="flex items-start gap-3">
              <Headphones className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span><strong className="text-text-primary">售後服務</strong> — 專業客服團隊隨時為您解決問題，讓您購買無後顧之憂。</span>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="card p-8 text-center">
          <h3 className="text-xl font-bold text-text-primary">準備好了嗎？</h3>
          <p className="mt-2 text-text-muted">立即瀏覽我們的商品，找到您需要的遊戲點數卡</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link to="/products" className="btn-primary inline-flex items-center gap-2 px-6 py-2">
              瀏覽商品 <ChevronRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg border border-border-default px-6 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-primary hover:text-primary">
              聯絡我們
            </Link>
          </div>
          {settings?.contact_email && (
            <p className="mt-4 text-sm text-text-muted">
              或直接寫信至 <a href={`mailto:${settings.contact_email}`} className="text-primary hover:underline">{settings.contact_email}</a>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
