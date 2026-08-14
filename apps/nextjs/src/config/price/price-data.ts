import { env } from "~/env.mjs";

interface SubscriptionPlanTranslation {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  limitations: string[];
  prices: {
    monthly: number;
    yearly: number;
  };
  stripeIds: {
    monthly: string | null;
    yearly: string | null;
  };
}

const stripePro = {
  monthly: env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID,
  yearly: env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID,
};

const stripeBusiness = {
  monthly: env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PRICE_ID,
  yearly: env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PRICE_ID,
};

export const priceDataMap: Record<string, SubscriptionPlanTranslation[]> = {
  zh: [
    {
      id: "starter",
      title: "Access",
      description: "开启旅程",
      benefits: [
        "1 个活跃业务工作区",
        "核心头脑风暴 + 计划审批",
        "品牌套件入门令牌",
      ],
      limitations: [
        "无多智能体编排",
        "标准支持时段",
        "无自定义金色强调主题",
      ],
      prices: { monthly: 0, yearly: 0 },
      stripeIds: { monthly: null, yearly: null },
    },
    {
      id: "pro",
      title: "Architect",
      description: "与 ADAPT 一同扩展",
      benefits: [
        "最多 3 个业务工作区",
        "完整 Brainstorm → Architect → Execute 循环",
        "品牌、营销与财务模块",
        "协助坞优先指导",
        "学院与网络研讨会",
      ],
      limitations: ["有限的白手套配置"],
      prices: { monthly: 30, yearly: 288 },
      stripeIds: stripePro,
    },
    {
      id: "business",
      title: "Fifth Avenue",
      description: "私密运营者层级",
      benefits: [
        "最多 10 个工作区",
        "实时智能体监控",
        "自定义品牌系统 + 金色强调",
        "专属配置支持",
        "与 Fifth Avenue Intelligence Group 私密演示",
      ],
      limitations: [],
      prices: { monthly: 60, yearly: 600 },
      stripeIds: stripeBusiness,
    },
  ],
  en: [
    {
      id: "starter",
      title: "Access",
      description: "Begin the journey",
      benefits: [
        "1 active business workspace",
        "Core brainstorm + plan approval",
        "Brand kit starter tokens",
      ],
      limitations: [
        "No multi-agent orchestration",
        "Standard support window",
        "No custom gold emphasis themes",
      ],
      prices: { monthly: 0, yearly: 0 },
      stripeIds: { monthly: null, yearly: null },
    },
    {
      id: "pro",
      title: "Architect",
      description: "Scale with ADAPT",
      benefits: [
        "Up to 3 business workspaces",
        "Full Brainstorm → Architect → Execute loop",
        "Brand, marketing, and finance modules",
        "Priority guidance from the assist dock",
        "Academy + webinar access",
      ],
      limitations: ["Limited white-glove configuration"],
      prices: { monthly: 30, yearly: 288 },
      stripeIds: stripePro,
    },
    {
      id: "business",
      title: "Fifth Avenue",
      description: "Private operator tier",
      benefits: [
        "Up to 10 workspaces",
        "Real-time agent monitoring",
        "Custom brand systems + gold emphasis",
        "Dedicated configuration support",
        "Private walkthrough with Fifth Avenue Intelligence Group",
      ],
      limitations: [],
      prices: { monthly: 60, yearly: 600 },
      stripeIds: stripeBusiness,
    },
  ],
  ja: [
    {
      id: "starter",
      title: "Access",
      description: "旅の始まり",
      benefits: [
        "アクティブなビジネスワークスペース 1 つ",
        "コア・ブレインストーム + プラン承認",
        "ブランドキットのスタータートークン",
      ],
      limitations: [
        "マルチエージェント連携なし",
        "標準サポート枠",
        "カスタム金アクセントなし",
      ],
      prices: { monthly: 0, yearly: 0 },
      stripeIds: { monthly: null, yearly: null },
    },
    {
      id: "pro",
      title: "Architect",
      description: "ADAPT でスケール",
      benefits: [
        "最大 3 ワークスペース",
        "Brainstorm → Architect → Execute の全ループ",
        "ブランド・マーケ・財務モジュール",
        "アシストドック優先ガイド",
        "アカデミー + ウェビナー",
      ],
      limitations: ["ホワイトグローブ設定は限定"],
      prices: { monthly: 30, yearly: 288 },
      stripeIds: stripePro,
    },
    {
      id: "business",
      title: "Fifth Avenue",
      description: "プライベート運営者層",
      benefits: [
        "最大 10 ワークスペース",
        "リアルタイム・エージェント監視",
        "カスタムブランド + 金アクセント",
        "専任設定サポート",
        "Fifth Avenue Intelligence Group とのプライベート説明",
      ],
      limitations: [],
      prices: { monthly: 60, yearly: 600 },
      stripeIds: stripeBusiness,
    },
  ],
  ko: [
    {
      id: "starter",
      title: "Access",
      description: "여정의 시작",
      benefits: [
        "활성 비즈니스 워크스페이스 1개",
        "핵심 브레인스토밍 + 계획 승인",
        "브랜드 키트 스타터 토큰",
      ],
      limitations: [
        "멀티 에이전트 오케스트레이션 없음",
        "표준 지원 창",
        "커스텀 골드 강조 테마 없음",
      ],
      prices: { monthly: 0, yearly: 0 },
      stripeIds: { monthly: null, yearly: null },
    },
    {
      id: "pro",
      title: "Architect",
      description: "ADAPT로 확장",
      benefits: [
        "최대 3개 워크스페이스",
        "전체 Brainstorm → Architect → Execute 루프",
        "브랜드, 마케팅, 재무 모듈",
        "어시스트 독 우선 가이드",
        "아카데미 + 웨비나",
      ],
      limitations: ["화이트글러브 설정 제한"],
      prices: { monthly: 30, yearly: 288 },
      stripeIds: stripePro,
    },
    {
      id: "business",
      title: "Fifth Avenue",
      description: "프라이빗 운영자 티어",
      benefits: [
        "최대 10개 워크스페이스",
        "실시간 에이전트 모니터링",
        "커스텀 브랜드 시스템 + 골드 강조",
        "전담 구성 지원",
        "Fifth Avenue Intelligence Group 프라이빗 워크스루",
      ],
      limitations: [],
      prices: { monthly: 60, yearly: 600 },
      stripeIds: stripeBusiness,
    },
  ],
};
