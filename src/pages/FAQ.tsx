import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, MessageCircle } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  name: string;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    name: '購買相關',
    items: [
      {
        q: '如何購買遊戲點數卡？',
        a: '在本網站選擇您想購買的遊戲點數卡，選擇面額後點擊「立即購買」，依照指示完成付款即可。購買完成後，點數卡序號將透過指定方式發送給您。',
      },
      {
        q: '購買後多久可以收到序號？',
        a: '大多數商品在付款確認後會即時發送序號。如遇系統繁忙或特殊狀況，最遲不超過 24 小時。如超過時間仍未收到，請聯繫客服。',
      },
      {
        q: '可以一次購買多張點數卡嗎？',
        a: '可以。您可以重複選購同一商品的不同面額，或同時購買多種不同的遊戲點數卡。',
      },
      {
        q: '購買時選錯面額怎麼辦？',
        a: '如序號尚未使用，請於 24 小時內聯繫客服申請退款或更換。已使用的序號無法退換。',
      },
    ],
  },
  {
    name: '付款相關',
    items: [
      {
        q: '支援哪些付款方式？',
        a: '目前支援信用卡、LINE Pay、超商代碼繳費等多種付款方式。詳細的付款方式請參閱結帳頁面的選項。',
      },
      {
        q: '付款安全嗎？',
        a: '本網站採用 SSL 加密技術，所有付款程序均由通過 PCI DSS 認證的第三方支付服務商處理，我們不會儲存您的信用卡資訊。',
      },
      {
        q: '可以開立發票嗎？',
        a: '可以。完成購買後系統會自動開立電子發票。如需統一編號，請於結帳時填入相關資訊。',
      },
    ],
  },
  {
    name: '商品相關',
    items: [
      {
        q: '你們販售的點數卡是正版的嗎？',
        a: '是的。本公司所販售的所有遊戲點數卡均為正版授權商品，直接從官方或授權經銷商取得，品質有保障。',
      },
      {
        q: '點數卡有使用期限嗎？',
        a: '各遊戲點數卡的使用期限依各遊戲廠商規定而異。建議購買後盡快儲值使用。詳細資訊請參閱各商品頁面的說明。',
      },
      {
        q: '點數卡序號無法使用怎麼辦？',
        a: '請先確認：(1) 序號是否正確輸入 (2) 是否選擇了正確的遊戲與伺服器 (3) 序號是否已過期。如確認無誤仍無法使用，請聯繫客服並提供訂單編號，我們將協助您處理。',
      },
      {
        q: '可以將點數卡轉送給朋友嗎？',
        a: '可以。點數卡序號可以提供給任何人使用，只要該序號尚未被儲值即可。但請注意保管好序號，避免外洩。',
      },
    ],
  },
  {
    name: '退款相關',
    items: [
      {
        q: '點數卡可以退款嗎？',
        a: '由於數位商品的特性，已發送的點數卡序號原則上不接受退款。但若因本公司系統異常導致序號無法使用，經查證後將全額退款。',
      },
      {
        q: '退款需要多久？',
        a: '退款申請審核通過後，將於 7-14 個工作天內退回原付款方式。實際到帳時間依各金融機構處理時間而定。',
      },
    ],
  },
  {
    name: '帳號與其他',
    items: [
      {
        q: '需要註冊帳號才能購買嗎？',
        a: '部分商品支援免註冊購買。註冊帳號後可享有訂單查詢、購買紀錄等便利功能。',
      },
      {
        q: '忘記密碼怎麼辦？',
        a: '請在登入頁面點選「忘記密碼」，輸入您的註冊信箱，系統將發送密碼重設連結至您的信箱。',
      },
      {
        q: '如何聯繫客服？',
        a: '您可透過「聯絡我們」頁面取得客服聯絡方式，包含電子郵件及電話。我們的客服團隊將盡速為您服務。',
      },
      {
        q: '你們的營業時間是？',
        a: '本網站 24 小時皆可進行購買。客服服務時間為週一至週五 09:00-18:00（國定假日除外）。',
      },
    ],
  },
];

function FAQAccordion({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border-default last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left transition-colors hover:text-primary"
      >
        <span className="text-sm font-medium text-text-primary">{item.q}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="pb-4">
          <p className="text-sm leading-relaxed text-text-secondary">{item.a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <HelpCircle className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-text-primary md:text-4xl">常見問題</h1>
        <p className="mt-2 text-text-muted">找不到答案？歡迎<Link to="/contact" className="text-primary hover:underline">聯絡我們</Link></p>
      </div>

      <div className="space-y-8">
        {faqData.map((category) => (
          <div key={category.name}>
            <h2 className="mb-4 text-lg font-semibold text-primary">{category.name}</h2>
            <div className="card divide-y divide-border-default px-6">
              {category.items.map((item, i) => (
                <FAQAccordion key={i} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Still need help */}
      <div className="mt-12 card p-8 text-center">
        <MessageCircle className="mx-auto h-10 w-10 text-primary" />
        <h3 className="mt-4 text-lg font-semibold text-text-primary">還有其他問題嗎？</h3>
        <p className="mt-2 text-sm text-text-muted">
          我們的客服團隊隨時準備為您服務
        </p>
        <Link to="/contact" className="btn-primary mt-4 inline-block px-6 py-2">
          聯絡客服
        </Link>
      </div>
    </div>
  );
}
