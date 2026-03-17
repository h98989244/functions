import { Shield, Mail, Database, Cookie, Lock, UserCheck, Eye } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const sections = [
  {
    icon: Database,
    title: '一、資料蒐集目的',
    content: `名將數位（以下簡稱「本公司」）依據中華民國《個人資料保護法》蒐集您的個人資料，目的包含：
• 處理您的訂單及提供遊戲點數卡商品與服務
• 客戶服務與售後支援
• 寄送交易通知及電子發票
• 改善網站使用體驗與服務品質
• 遵守法律及法規要求`,
  },
  {
    icon: UserCheck,
    title: '二、蒐集的個人資料類別',
    content: `本公司可能蒐集以下類別的個人資料：
• 基本資料：姓名、電子郵件地址、聯絡電話
• 交易資料：購買紀錄、訂單編號、交易金額
• 技術資料：IP 位址、瀏覽器類型、裝置資訊、瀏覽行為
• 客服紀錄：您與客服之間的通訊紀錄

本公司不會蒐集您的信用卡號碼或銀行帳戶等敏感財務資訊，付款程序由第三方支付服務商處理。`,
  },
  {
    icon: Eye,
    title: '三、資料利用方式',
    content: `• 利用期間：自蒐集日起至服務目的消失或您請求刪除為止
• 利用地區：中華民國境內
• 利用對象：本公司及必要之合作夥伴（如金流服務商、物流業者）
• 利用方式：以電子化方式儲存及處理，並採取適當安全措施

本公司不會將您的個人資料出售予第三方，亦不會用於與服務無關的行銷用途。`,
  },
  {
    icon: Cookie,
    title: '四、Cookie 政策',
    content: `本網站使用 Cookie 及類似技術以：
• 維持您的登入狀態與購物車資訊
• 記錄您的偏好設定
• 分析網站流量與使用模式（透過 Google Analytics 等工具）

您可透過瀏覽器設定管理或刪除 Cookie。停用 Cookie 可能影響網站部分功能的正常運作。`,
  },
  {
    icon: Lock,
    title: '五、資料安全措施',
    content: `本公司採取以下措施保護您的個人資料安全：
• 使用 SSL/TLS 加密技術傳輸敏感資訊
• 實施存取控制，僅授權人員可存取個人資料
• 定期進行安全性檢測與系統更新
• 與第三方服務商簽署資料保護條款

儘管我們盡力保護您的資料，但無法保證網路傳輸的絕對安全性。`,
  },
  {
    icon: UserCheck,
    title: '六、當事人權利',
    content: `依據《個人資料保護法》，您享有以下權利：
• 查詢或請求閱覽您的個人資料
• 請求製給複本
• 請求補充或更正個人資料
• 請求停止蒐集、處理或利用個人資料
• 請求刪除個人資料

如欲行使上述權利，請透過本頁底部的聯絡方式與我們聯繫，我們將於收到申請後 30 日內回覆。`,
  },
  {
    icon: Shield,
    title: '七、兒童隱私保護',
    content: `本網站服務對象為年滿 18 歲之成年人。若您未滿 18 歲，請在法定代理人的陪同及同意下使用本網站服務。如本公司發現未經法定代理人同意而蒐集之未成年人資料，將立即刪除相關資料。`,
  },
  {
    icon: Database,
    title: '八、政策修改',
    content: `本公司保留隨時修改本隱私權政策之權利。政策修改後將公告於本頁面，並更新「最後更新日期」。建議您定期查閱本政策以瞭解最新資訊。重大變更時，我們將透過網站公告或電子郵件通知您。`,
  },
];

export default function Privacy() {
  const { data: settings } = useSiteSettings();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-text-primary md:text-4xl">隱私權政策</h1>
        <p className="mt-2 text-sm text-text-muted">最後更新日期：2025 年 1 月</p>
      </div>

      <div className="card mb-8 p-6">
        <p className="text-sm leading-relaxed text-text-secondary">
          名將數位非常重視您的隱私權保護。本隱私權政策說明我們如何蒐集、使用、保護及分享您的個人資料。使用本網站即表示您同意本政策之內容。
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((section, i) => (
          <div key={i} className="card p-6">
            <div className="mb-3 flex items-center gap-3">
              <section.icon className="h-5 w-5 shrink-0 text-primary" />
              <h2 className="text-lg font-semibold text-text-primary">{section.title}</h2>
            </div>
            <p className="whitespace-pre-line text-sm leading-relaxed text-text-secondary">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="mt-8 card p-6">
        <div className="mb-3 flex items-center gap-3">
          <Mail className="h-5 w-5 shrink-0 text-primary" />
          <h2 className="text-lg font-semibold text-text-primary">九、聯絡方式</h2>
        </div>
        <p className="text-sm leading-relaxed text-text-secondary">
          如您對本隱私權政策有任何疑問，或欲行使您的個人資料相關權利，歡迎透過以下方式聯繫我們：
        </p>
        {settings && (
          <div className="mt-4 space-y-2 text-sm text-text-secondary">
            {settings.contact_email && (
              <p>電子郵件：<a href={`mailto:${settings.contact_email}`} className="text-primary hover:underline">{settings.contact_email}</a></p>
            )}
            {settings.contact_phone && (
              <p>聯絡電話：<a href={`tel:${settings.contact_phone}`} className="text-primary hover:underline">{settings.contact_phone}</a></p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
