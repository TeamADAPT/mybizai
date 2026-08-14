interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const enFaqs: FAQItem[] = [
  {
    id: "item-1",
    question: "What does the Access plan include?",
    answer:
      "Access is free — one business workspace, core brainstorm and plan approval, and starter brand-kit tokens. No monthly or annual charge.",
  },
  {
    id: "item-2",
    question: "How much is the Architect plan?",
    answer:
      "Architect is $30/month (or $288/year). It unlocks up to three workspaces and the full Brainstorm → Architect → Execute loop with brand, marketing, and finance modules.",
  },
  {
    id: "item-3",
    question: "What is Fifth Avenue tier?",
    answer:
      "Fifth Avenue is our private operator plan at $60/month (or $600/year): up to ten workspaces, real-time agent monitoring, custom brand systems, and a walkthrough with Fifth Avenue Intelligence Group.",
  },
  {
    id: "item-4",
    question: "Do you offer annual billing?",
    answer:
      "Yes. Architect annual is $288; Fifth Avenue annual is $600 — savings versus month-to-month.",
  },
  {
    id: "item-5",
    question: "Is there a trial before upgrading?",
    answer:
      "Paid plans can be explored in sandbox mode without charges. For a private walkthrough, request access and we’ll schedule time with the team.",
  },
];

export const priceFaqDataMap: Record<string, FAQItem[]> = {
  en: enFaqs,
  zh: [
    {
      id: "item-1",
      question: "Access 计划包含什么？",
      answer:
        "Access 免费：1 个业务工作区、核心头脑风暴与计划审批、品牌套件入门令牌。无月费或年费。",
    },
    {
      id: "item-2",
      question: "Architect 计划费用？",
      answer:
        "Architect 为每月 $30（或每年 $288），解锁最多 3 个工作区以及完整 Brainstorm → Architect → Execute 循环。",
    },
    {
      id: "item-3",
      question: "什么是 Fifth Avenue？",
      answer:
        "Fifth Avenue 为私密运营者计划，每月 $60（或每年 $600）：最多 10 个工作区、实时智能体监控、自定义品牌，并与 Fifth Avenue Intelligence Group 进行演示。",
    },
    {
      id: "item-4",
      question: "是否提供年付？",
      answer: "是。Architect 年付 $288；Fifth Avenue 年付 $600，比月付更省。",
    },
    {
      id: "item-5",
      question: "升级前有试用吗？",
      answer:
        "付费计划可在沙盒模式体验且不扣费。需要私密演示请申请访问，我们将安排时间。",
    },
  ],
  ja: [
    {
      id: "item-1",
      question: "Access プランに含まれるものは？",
      answer:
        "Access は無料。ワークスペース 1 つ、コア・ブレインストームとプラン承認、ブランドキットのスタータートークン。月額・年額なし。",
    },
    {
      id: "item-2",
      question: "Architect の料金は？",
      answer:
        "Architect は月額 $30（年額 $288）。最大 3 ワークスペースと Brainstorm → Architect → Execute の全ループ。",
    },
    {
      id: "item-3",
      question: "Fifth Avenue とは？",
      answer:
        "プライベート運営者プラン。月額 $60（年額 $600）。最大 10 ワークスペース、リアルタイム監視、カスタムブランド、Fifth Avenue Intelligence Group との説明会。",
    },
    {
      id: "item-4",
      question: "年額請求はありますか？",
      answer:
        "はい。Architect 年額 $288、Fifth Avenue 年額 $600 で月額よりお得です。",
    },
    {
      id: "item-5",
      question: "アップグレード前のトライアルは？",
      answer:
        "有料プランはサンドボックスで課金なしに試せます。プライベート説明はアクセス申請から。",
    },
  ],
  ko: [
    {
      id: "item-1",
      question: "Access 플랜에는 무엇이 포함되나요?",
      answer:
        "Access는 무료입니다. 워크스페이스 1개, 핵심 브레인스토밍과 계획 승인, 브랜드 키트 스타터 토큰. 월/연 요금 없음.",
    },
    {
      id: "item-2",
      question: "Architect 요금은?",
      answer:
        "Architect는 월 $30(연 $288). 최대 3개 워크스페이스와 전체 Brainstorm → Architect → Execute 루프.",
    },
    {
      id: "item-3",
      question: "Fifth Avenue란?",
      answer:
        "프라이빗 운영자 플랜. 월 $60(연 $600). 최대 10개 워크스페이스, 실시간 모니터링, 커스텀 브랜드, Fifth Avenue Intelligence Group 워크스루.",
    },
    {
      id: "item-4",
      question: "연간 결제가 있나요?",
      answer:
        "네. Architect 연 $288, Fifth Avenue 연 $600으로 월간보다 절약됩니다.",
    },
    {
      id: "item-5",
      question: "업그레이드 전 체험이 있나요?",
      answer:
        "유료 플랜은 샌드박스에서 과금 없이 탐색할 수 있습니다. 프라이빗 워크스루는 액세스 신청으로 예약하세요.",
    },
  ],
};
