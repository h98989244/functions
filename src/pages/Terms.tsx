import { FileText, AlertTriangle, Mail } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const sections = [
  {
    title: '第一條　服務說明',
    content: `名將數位（以下簡稱「本公司」）透過本網站提供遊戲點數卡之線上販售服務。本公司所販售之商品均為正版授權之數位商品，包含但不限於遊戲點數卡、儲值卡及相關數位商品。`,
  },
  {
    title: '第二條　使用者資格',
    content: `使用本網站服務前，您應確認：
• 您已年滿 18 歲，具完全行為能力
• 未滿 18 歲者需經法定代理人同意後始得使用
• 您提供之所有資料均為真實、正確、最新且完整
• 您同意遵守中華民國相關法令規定`,
  },
  {
    title: '第三條　購買流程與付款',
    content: `• 您可透過本網站瀏覽並選購遊戲點數卡商品
• 選擇商品及面額後，依指示完成付款程序
• 付款方式以本網站公告之支付方式為準
• 付款完成後，系統將自動發送商品序號至您指定的方式
• 訂單成立後，本公司將盡速處理，如遇系統異常將另行通知`,
  },
  {
    title: '第四條　商品性質',
    content: `• 本網站所販售之商品為數位虛擬商品（遊戲點數卡序號）
• 數位商品一經發送，即視為已提供服務
• 商品序號具有唯一性，一經使用即無法回復
• 請於購買前確認所需之遊戲、伺服器及面額等資訊`,
  },
  {
    title: '第五條　退款政策',
    content: `基於數位商品之特性，本公司退款政策如下：
• 數位商品一經發送，原則上不接受退貨退款
• 若因本公司系統異常導致商品無法使用，經查證屬實後將全額退款
• 因操作錯誤購買錯誤商品，且序號尚未使用者，可於 24 小時內申請退款
• 退款將於審核通過後 7-14 個工作天內退回原付款方式
• 如有爭議，依消費者保護法相關規定辦理`,
  },
  {
    title: '第六條　智慧財產權',
    content: `• 本網站之所有內容（包含但不限於文字、圖片、標誌、網頁設計）均受著作權法保護
• 遊戲名稱、商標及相關圖像為各遊戲公司所有
• 未經本公司書面授權，不得擅自複製、修改、散佈本網站之任何內容
• 本公司尊重第三方智慧財產權，如有侵權疑慮請聯繫本公司`,
  },
  {
    title: '第七條　免責聲明',
    content: `• 本公司不對遊戲本身之內容、品質或穩定性負責
• 因不可抗力因素（如天災、戰爭、政府行為、網路攻擊）導致服務中斷，本公司不負賠償責任
• 因遊戲廠商政策變更導致點數卡使用規則改變，本公司不負賠償責任
• 本網站可能包含第三方連結，本公司不對第三方網站之內容負責`,
  },
  {
    title: '第八條　帳號安全',
    content: `• 您有義務妥善保管帳號及密碼
• 不得將帳號提供予第三人使用
• 如發現帳號遭未經授權使用，應立即通知本公司
• 因您未妥善保管帳號資訊所生之損害，本公司不負賠償責任`,
  },
  {
    title: '第九條　禁止行為',
    content: `使用本網站時，您不得從事以下行為：
• 利用本網站進行詐騙、洗錢或其他違法行為
• 使用自動化工具大量購買或干擾網站正常運作
• 冒用他人身分或提供虛偽資料進行交易
• 嘗試入侵、破壞本網站系統安全
• 其他違反中華民國法令或公序良俗之行為

本公司有權對違反上述規定之使用者暫停或終止服務。`,
  },
  {
    title: '第十條　準據法與管轄法院',
    content: `• 本條款之解釋與適用，以中華民國法律為準據法
• 如因本條款發生爭議，雙方同意先以協商方式解決
• 協商不成時，同意以臺灣臺北地方法院為第一審管轄法院
• 本條款之任何條款如經法院認定無效，不影響其餘條款之效力`,
  },
  {
    title: '第十一條　條款修改',
    content: `• 本公司保留隨時修改本服務條款之權利
• 修改後之條款將公告於本頁面並更新「最後更新日期」
• 繼續使用本網站即視為您同意修改後之條款
• 如不同意修改後之條款，應立即停止使用本網站服務`,
  },
];

export default function Terms() {
  const { data: settings } = useSiteSettings();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-text-primary md:text-4xl">服務條款</h1>
        <p className="mt-2 text-sm text-text-muted">最後更新日期：2025 年 1 月</p>
      </div>

      <div className="card mb-8 p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <p className="text-sm leading-relaxed text-text-secondary">
            歡迎使用名將數位網站。在使用本網站服務前，請詳細閱讀以下條款。當您使用本網站時，即表示您已閱讀、瞭解並同意接受以下所有條款及條件的約束。
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section, i) => (
          <div key={i} className="card p-6">
            <h2 className="mb-3 text-lg font-semibold text-text-primary">{section.title}</h2>
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
          <h2 className="text-lg font-semibold text-text-primary">第十二條　聯絡方式</h2>
        </div>
        <p className="text-sm leading-relaxed text-text-secondary">
          如您對本服務條款有任何疑問，歡迎透過以下方式與我們聯繫：
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
