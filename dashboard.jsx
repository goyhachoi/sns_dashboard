import { useState, useEffect, useRef } from "react";
import { supabase, DEMO_MODE } from "./supabase.js";

// --- Icons (inline SVG components) ---
const Icons = {
  Home: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Calendar: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Edit: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Send: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  MessageCircle: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  BarChart: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
  Zap: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  TrendUp: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  TrendDown: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Clock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Eye: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Heart: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  Share: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  ChevronRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  AlertTriangle: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  ExternalLink: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  Copy: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Download: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Key: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
  Link2: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  EyeOff: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
};

// --- Platform colors & data ---
const PLATFORMS = {
  instagram: { name: "Instagram", color: "#E1306C", bg: "#E1306C15", icon: "📸" },
  facebook: { name: "Facebook", color: "#1877F2", bg: "#1877F215", icon: "👤" },
  twitter: { name: "X (Twitter)", color: "#14171A", bg: "#14171A12", icon: "𝕏" },
  threads: { name: "Threads", color: "#6B7280", bg: "#6B728015", icon: "🔗" },
  youtube: { name: "YouTube", color: "#FF0000", bg: "#FF000012", icon: "▶️" },
};

// --- Simulated Data ---
const MOCK_KPI = [
  { label: "총 팔로워", value: "128,430", change: "+2.4%", up: true },
  { label: "이번 주 도달", value: "45,200", change: "+12.1%", up: true },
  { label: "인게이지먼트율", value: "4.7%", change: "-0.3%", up: false },
  { label: "예약 대기", value: "7건", change: "", up: true },
];

const MOCK_CALENDAR = [
  { day: 10, platform: "instagram", title: "신제품 런칭 캐러셀", status: "approved" },
  { day: 10, platform: "facebook", title: "신제품 런칭 포스트", status: "approved" },
  { day: 11, platform: "twitter", title: "트렌드 밈 콘텐츠", status: "draft" },
  { day: 12, platform: "youtube", title: "제품 리뷰 숏츠", status: "review" },
  { day: 13, platform: "instagram", title: "브랜드 스토리 릴스", status: "draft" },
  { day: 14, platform: "threads", title: "주간 인사이트 스레드", status: "approved" },
  { day: 15, platform: "twitter", title: "이벤트 공지", status: "draft" },
  { day: 16, platform: "instagram", title: "UGC 리그램", status: "review" },
];

const MOCK_COMMENTS = [
  { platform: "instagram", user: "김민수", text: "이 제품 색상 다른 것도 있나요?", sentiment: "neutral", time: "5분 전", replied: false },
  { platform: "instagram", user: "이서연", text: "진짜 너무 예뻐요!! 바로 구매했어요 💕", sentiment: "positive", time: "12분 전", replied: false },
  { platform: "facebook", user: "박지훈", text: "배송이 3일째 안 오는데 어떻게 된 건가요?", sentiment: "negative", time: "23분 전", replied: false },
  { platform: "twitter", user: "최유나", text: "할인 이벤트 언제 또 하나요?", sentiment: "neutral", time: "1시간 전", replied: true },
  { platform: "youtube", user: "정태우", text: "영상 퀄리티 미쳤다 ㄷㄷ", sentiment: "positive", time: "2시간 전", replied: true },
  { platform: "threads", user: "한소희", text: "이런 브랜드 처음 봐요 팔로우 합니다", sentiment: "positive", time: "3시간 전", replied: false },
];

const MOCK_POSTS_RANKING = [
  { title: "여름 신상 캐러셀", platform: "instagram", reach: 12400, engage: 890, rate: "7.2%", format: "캐러셀" },
  { title: "제품 비하인드 릴스", platform: "instagram", reach: 9800, engage: 720, rate: "7.3%", format: "릴스" },
  { title: "브랜드 스토리 영상", platform: "youtube", reach: 8200, engage: 410, rate: "5.0%", format: "영상" },
  { title: "이벤트 공지 포스트", platform: "facebook", reach: 6500, engage: 280, rate: "4.3%", format: "이미지" },
  { title: "트렌드 밈 트윗", platform: "twitter", reach: 15200, engage: 1100, rate: "7.2%", format: "텍스트" },
];

// --- 콘텐츠 관리 목업 데이터 ---
const MOCK_CONTENTS_DATA = [
  {
    id: 1,
    registrant: "양승현",
    registeredAt: "2026-03-20",
    title: "Antigravity 라이브러리 소개",
    masterText: "Antigravity(안티그래비티)는 파이썬 기반의 웹 자동화 라이브러리입니다. 기존의 Selenium이나 Playwright와 달리, 사람처럼 자연스러운 브라우저 조작이 가능하며 봇 탐지를 우회할 수 있습니다.",
    status: "scheduled",
    scheduledAt: "2026-03-22 14:00",
    platforms: ["twitter", "youtube", "facebook"],
    platformDrafts: {
      twitter: "🚀 웹 자동화의 새 패러다임, Antigravity 출시!\n\n봇 탐지 없이 자연스럽게 브라우저를 조작하는 Python 라이브러리. 마케터, 데이터 분석가 모두 코딩 최소화로 반복 업무를 자동화할 수 있습니다.\n\n#Antigravity #Python #자동화",
      youtube: "Antigravity 라이브러리 완전 정복 | 봇 탐지 우회 자동화 도구\n\n✅ 이 영상에서 배울 내용:\n- Antigravity가 기존 도구와 다른 점\n- 설치 및 첫 번째 스크립트 작성\n- SNS 자동화 실전 예제\n\n#자동화 #Python",
      facebook: "🎉 Antigravity 라이브러리를 소개합니다!\n\nPython 기반으로 웹 자동화를 더 쉽고 안전하게. 코딩 경험이 없어도 반복 업무를 자동화할 수 있어요.",
      instagram: "",
      threads: "",
    },
  },
  {
    id: 2,
    registrant: "양승현",
    registeredAt: "2026-03-21",
    title: "봇 탐지 우회 기능 소개",
    masterText: "기존 Selenium이나 Playwright와 달리, Antigravity는 사람처럼 자연스러운 브라우저 조작이 가능하며 봇 감지 시스템을 자연스럽게 통과합니다.",
    status: "draft",
    scheduledAt: null,
    platforms: ["instagram", "threads"],
    platformDrafts: {
      twitter: "",
      youtube: "",
      facebook: "",
      instagram: "🤖 봇도 사람처럼?\n\n기존 자동화 도구들과 달리 Antigravity는 실제 사람의 행동 패턴을 완벽하게 모방합니다.\n\n#자동화 #Python #봇탐지",
      threads: "봇 탐지 우회가 가능한 웹 자동화 라이브러리가 있다면 믿으시겠나요?\n\nAntigravity는 실제 브라우저 환경에서 인간의 행동을 재현합니다. 자연스러운 마우스 이동, 키보드 딜레이까지 모두 구현했습니다.",
    },
  },
  {
    id: 3,
    registrant: "양승현",
    registeredAt: "2026-03-19",
    title: "주간 업데이트 공지",
    masterText: "이번 주 Antigravity v1.2 업데이트가 출시되었습니다. 성능 개선, 버그 수정, Instagram API 지원이 새롭게 추가되었습니다.",
    status: "published",
    scheduledAt: "2026-03-20 10:00",
    platforms: ["twitter", "facebook", "instagram", "threads", "youtube"],
    platformDrafts: {},
  },
  {
    id: 4,
    registrant: "양승현",
    registeredAt: "2026-03-18",
    title: "사용 사례 - 마케팅 자동화편",
    masterText: "SNS 콘텐츠 자동 발행, 경쟁사 모니터링, 리뷰/댓글 자동 수집 등 마케팅 실무에서 Antigravity를 활용하는 다양한 사례를 소개합니다.",
    status: "review",
    scheduledAt: "2026-03-28 18:00",
    platforms: ["instagram", "youtube", "facebook"],
    platformDrafts: {
      twitter: "",
      youtube: "마케터를 위한 Antigravity 완전 활용법 | SNS 자동화 실전편\n\n실제 마케팅 현장에서 Antigravity를 활용하는 5가지 방법을 공개합니다.",
      facebook: "마케팅 자동화, 이제 Antigravity로 해결하세요!\n\n경쟁사 모니터링부터 SNS 멀티채널 발행까지, 반복 업무를 자동화해서 크리에이티브에 집중하세요.",
      instagram: "마케터의 필수 도구 🛠️\n\nAntigravity 하나로 SNS 자동화, 데이터 수집, 경쟁사 모니터링까지!\n\n#마케팅자동화 #SNS마케팅 #Python",
      threads: "",
    },
  },
];

const MOCK_MEMBERS = [
  { id: 1, name: "양승현", email: "yang@antigravity.io", joinedAt: "2026-03-01", approvalStatus: "approved", role: "admin" },
  { id: 2, name: "김지원", email: "jiwon@antigravity.io", joinedAt: "2026-03-15", approvalStatus: "approved", role: "operator" },
  { id: 3, name: "박민준", email: "minjun@example.com", joinedAt: "2026-03-20", approvalStatus: "pending", role: "operator" },
  { id: 4, name: "이서연", email: "seoyeon@example.com", joinedAt: "2026-03-21", approvalStatus: "pending", role: "operator" },
];

const MOCK_COMPETITORS = [
  { name: "경쟁사 A", followers: "245K", postFreq: "일 2회", topFormat: "릴스", engageRate: "5.1%" },
  { name: "경쟁사 B", followers: "189K", postFreq: "일 1회", topFormat: "캐러셀", engageRate: "4.8%" },
  { name: "경쟁사 C", followers: "92K", postFreq: "주 4회", topFormat: "이미지", engageRate: "6.2%" },
];

const MOCK_TRENDS = [
  { keyword: "#여름코디", volume: "↑ 340%", status: "급상승" },
  { keyword: "#데일리룩", volume: "↑ 12%", status: "상승" },
  { keyword: "#OOTD", volume: "→ 0%", status: "유지" },
  { keyword: "#미니멀패션", volume: "↑ 89%", status: "상승" },
  { keyword: "#빈티지무드", volume: "↓ 15%", status: "하락" },
];

// --- 성과 분석 목업 데이터 ---
const MOCK_CHANNEL_STATS = {
  instagram: { views: 12400, likes: 890, comments: 145, shares: 230, saves: 560 },
  facebook:  { views: 6500,  likes: 280, comments: 67,  shares: 145, saves: 0 },
  twitter:   { views: 15200, likes: 1100, comments: 320, shares: 890, saves: 0 },
  threads:   { views: 3200,  likes: 210, comments: 45,  shares: 80,  saves: 0 },
  youtube:   { views: 8200,  likes: 410, comments: 89,  shares: 120, saves: 340 },
};

const MOCK_CONTENT_STATS = [
  { title: "Antigravity 라이브러리 소개", platform: "twitter",   views: 4200, likes: 340, comments: 89, shares: 210, saves: 0 },
  { title: "Antigravity 라이브러리 소개", platform: "youtube",   views: 3100, likes: 180, comments: 42, shares: 60,  saves: 120 },
  { title: "봇 탐지 우회 기능 소개",      platform: "instagram", views: 5800, likes: 420, comments: 67, shares: 95,  saves: 280 },
  { title: "봇 탐지 우회 기능 소개",      platform: "threads",   views: 2400, likes: 190, comments: 38, shares: 72,  saves: 0 },
  { title: "주간 업데이트 공지",           platform: "facebook",  views: 2100, likes: 98,  comments: 23, shares: 45,  saves: 0 },
  { title: "사용 사례 - 마케팅 자동화편", platform: "instagram", views: 6600, likes: 470, comments: 78, shares: 135, saves: 280 },
  { title: "사용 사례 - 마케팅 자동화편", platform: "youtube",   views: 5100, likes: 230, comments: 47, shares: 60,  saves: 220 },
];

// --- Chart component (simple bar/line with CSS) ---
const MiniBarChart = ({ data, color = "#6366f1", height = 100 }) => {
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height, padding: "8px 0" }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div
            style={{
              width: "100%",
              maxWidth: 32,
              height: `${(v / max) * 100}%`,
              background: `linear-gradient(180deg, ${color}, ${color}88)`,
              borderRadius: "4px 4px 2px 2px",
              minHeight: 4,
              transition: "height 0.6s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </div>
      ))}
    </div>
  );
};

const MiniLineChart = ({ data, color = "#6366f1", height = 80 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 80 - 10}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`lg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,100 ${points} 100,100`} fill={`url(#lg-${color.replace("#", "")})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// 성과 분석용 멀티 라인 차트 (지표별 개별 정규화)
const METRIC_COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

const MetricsLineChart = ({ labels, series, height = 200 }) => {
  const PL = 8, PR = 24, PT = 16, PB = 44;
  const VW = 600, VH = height;
  const CW = VW - PL - PR;
  const CH = VH - PT - PB;
  const getX = (i) => PL + (labels.length <= 1 ? CW / 2 : (i / (labels.length - 1)) * CW);
  const getY = (v, min, max) => PT + CH - ((v - min) / (max - min || 1)) * CH;

  return (
    <div style={{ marginTop: 20 }}>
      <svg viewBox={`0 0 ${VW} ${VH}`} style={{ width: "100%", height }}>
        {/* 수평 격자선 */}
        {[0, 0.25, 0.5, 0.75, 1].map(t => (
          <line key={t} x1={PL} x2={VW - PR} y1={PT + CH * (1 - t)} y2={PT + CH * (1 - t)} stroke="#f1f5f9" strokeWidth="1" />
        ))}
        {/* 지표별 선 + 점 */}
        {series.map((s, si) => {
          const color = METRIC_COLORS[si % METRIC_COLORS.length];
          const max = Math.max(...s.data, 1);
          const min = Math.min(...s.data, 0);
          const pts = s.data.map((v, i) => `${getX(i)},${getY(v, min, max)}`).join(" ");
          return (
            <g key={si}>
              <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {s.data.map((v, i) => (
                <circle key={i} cx={getX(i)} cy={getY(v, min, max)} r="4.5" fill={color} stroke="#fff" strokeWidth="2" />
              ))}
            </g>
          );
        })}
        {/* x축 레이블 */}
        {labels.map((l, i) => (
          <text key={i} x={getX(i)} y={VH - PB + 20} textAnchor="middle" fontSize="12" fill="#94a3b8">
            {l.length > 9 ? l.slice(0, 8) + "…" : l}
          </text>
        ))}
      </svg>
      {/* 범례 */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", paddingLeft: PL, marginTop: 4 }}>
        {series.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b" }}>
            <div style={{ width: 20, height: 3, borderRadius: 2, background: METRIC_COLORS[i % METRIC_COLORS.length] }} />
            {s.name}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main App ---
export default function SNSDashboard() {
  const [activeMenu, setActiveMenu] = useState("contents");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [multiUseInput, setMultiUseInput] = useState(`Antigravity(안티그래비티)는 파이썬 기반의 웹 자동화 라이브러리입니다. 기존의 Selenium이나 Playwright와 달리, 사람처럼 자연스러운 브라우저 조작이 가능하며 봇 탐지를 우회할 수 있습니다. 마케터, 데이터 분석가, 업무 자동화가 필요한 실무자들이 코딩 없이도 반복적인 웹 작업을 자동화할 수 있도록 설계되었습니다.\n\n주요 특징으로는 첫째, 실제 브라우저 환경에서 동작하여 로그인, 클릭, 스크롤, 입력 등 사람의 행동을 그대로 재현합니다. 둘째, 봇 감지 시스템을 자연스럽게 통과하여 SNS 자동화, 데이터 수집 등에 활용할 수 있습니다. 셋째, Python만 알면 누구나 쉽게 시작할 수 있으며, 복잡한 워크플로우도 간단한 코드로 구현 가능합니다.\n\n활용 사례로는 SNS 콘텐츠 자동 발행, 경쟁사 모니터링, 리뷰/댓글 자동 수집, 반복적인 관리자 업무 자동화 등이 있습니다. 특히 마케팅 실무에서는 여러 SNS 채널에 동시에 콘텐츠를 배포하고, 성과 데이터를 자동으로 수집·분석하는 워크플로우를 구축하는 데 매우 유용합니다.`);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [benchmarkUrl, setBenchmarkUrl] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState(["instagram", "facebook", "twitter", "threads", "youtube"]);
  const [commentFilter, setCommentFilter] = useState("all");
  const [calendarMonth] = useState("2026년 3월");
  const [analysisView, setAnalysisView] = useState("overview");
  const [showBenchmarkResult, setShowBenchmarkResult] = useState(false);
  const [publishChecked, setPublishChecked] = useState({});
  const [aiInsight, setAiInsight] = useState(false);

  // 콘텐츠 관리 상태
  const [contentsView, setContentsView] = useState("list"); // "list" | "edit"
  const [editingContent, setEditingContent] = useState(null);
  const [contentFilter, setContentFilter] = useState("all");
  const [contentEditTab, setContentEditTab] = useState("twitter");
  const [publishMode, setPublishMode] = useState("now"); // "now" | "schedule"
  const [contentsList, setContentsList] = useState([]);

  // Supabase DB → JS 변환 헬퍼
  const dbToContent = (row) => ({
    id: row.id,
    title: row.title || "",
    masterText: row.master_text || "",
    status: row.status || "draft",
    scheduledAt: row.scheduled_at ? row.scheduled_at.replace("T", " ").slice(0, 16) : null,
    platforms: row.platforms || [],
    platformDrafts: row.platform_drafts || {},
    publishResults: row.publish_results || {},
    registrant: row.registrant || "",
    registeredAt: row.registered_at || "",
    firstPublishedAt: row.first_published_at ? row.first_published_at.replace("T", " ").slice(0, 16) : null,
    updatedAt: row.updated_at ? row.updated_at.replace("T", " ").slice(0, 16) : null,
  });

  // JS → Supabase DB 변환 헬퍼
  const contentToDb = (c) => ({
    title: c.title,
    master_text: c.masterText,
    status: c.status,
    scheduled_at: c.scheduledAt || null,
    platforms: c.platforms,
    platform_drafts: c.platformDrafts,
    publish_results: c.publishResults || {},
    registrant: c.registrant,
    registered_at: c.registeredAt || new Date().toISOString().slice(0, 10),
    first_published_at: c.firstPublishedAt || null,
    updated_at: c.updatedAt || null,
  });

  // 콘텐츠 목록 불러오기
  useEffect(() => {
    if (DEMO_MODE) {
      setContentsList(MOCK_CONTENTS_DATA);
      return;
    }
    supabase.from("contents").select("*").order("id", { ascending: false })
      .then(({ data, error }) => {
        if (error) { console.error("콘텐츠 불러오기 오류:", error); return; }
        setContentsList((data || []).map(dbToContent));
      });
  }, []);

  // AI 도구 관리 (Supabase settings 영속)
  const AI_TOOLS_DEFAULT = [
    { icon: "🤖", label: "ChatGPT로 작성", url: "https://chat.openai.com", desc: "내 GPTs 활용" },
    { icon: "✨", label: "Gemini로 작성", url: "https://gemini.google.com", desc: "내 Gems 활용" },
    { icon: "🎨", label: "Canva 이미지", url: "https://www.canva.com", desc: "SNS 맞춤 디자인" },
    { icon: "🎬", label: "CapCut 영상", url: "https://www.capcut.com", desc: "숏츠/릴스 제작" },
    { icon: "🖼️", label: "Ideogram AI", url: "https://ideogram.ai", desc: "AI 이미지 생성" },
  ];
  const [aiTools, setAiTools] = useState(AI_TOOLS_DEFAULT);
  useEffect(() => {
    supabase.from("settings").select("value").eq("key", "ai_tools").single()
      .then(({ data }) => { if (data?.value) setAiTools(data.value); });
  }, []);
  const saveAiToolsToDb = async (updated) => {
    setAiTools(updated);
    await supabase.from("settings").upsert({ key: "ai_tools", value: updated, updated_at: new Date().toISOString() });
  };
  const [aiToolEditMode, setAiToolEditMode] = useState(null); // null | "add" | index
  const [aiToolEditData, setAiToolEditData] = useState({ icon: "", label: "", url: "", desc: "" });

  // 편집 화면 하단 플랫폼 카드 순서 (localStorage 영속)
  const [draftPlatformOrder, setDraftPlatformOrder] = useState(() => {
    const saved = localStorage.getItem("draftPlatformOrder");
    return saved ? JSON.parse(saved) : ["twitter", "youtube", "facebook", "instagram", "threads"];
  });
  const draftPlatformDragRef = useRef(null);

  // 초안 자동 생성
  const [draftPrompts, setDraftPrompts] = useState([]);
  const [selectedPromptId, setSelectedPromptId] = useState(null); // null | "new" | number(id)
  const [draftPromptEdit, setDraftPromptEdit] = useState({ title: "", content: "" });
  const [draftGenPlatforms, setDraftGenPlatforms] = useState(["twitter", "youtube", "facebook", "instagram", "threads"]);
  const [isDraftGenerating, setIsDraftGenerating] = useState(false);
  const [optimizationTab, setOptimizationTab] = useState("pattern");
  useEffect(() => {
    supabase.from("settings").select("value").eq("key", "draft_prompts").single()
      .then(({ data }) => {
        if (data?.value) {
          setDraftPrompts(data.value);
          // 첫 번째 프롬프트 자동 선택
          if (data.value.length > 0) {
            setSelectedPromptId(data.value[0].id);
            setDraftPromptEdit({ title: data.value[0].title, content: data.value[0].content });
          }
        } else {
          // 저장된 프롬프트 없으면 새 프롬프트 모드로 시작
          setSelectedPromptId("new");
        }
      });
  }, []);
  const saveDraftPromptsToDb = async (updated) => {
    setDraftPrompts(updated);
    const { error } = await supabase.from("settings").upsert({ key: "draft_prompts", value: updated, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
  };

  // 콘텐츠 목록 검색 상태 (입력 중)
  const [searchTitle, setSearchTitle] = useState("");
  const [searchPlatforms, setSearchPlatforms] = useState(["twitter", "youtube", "facebook", "instagram", "threads"]);
  const [searchStatuses, setSearchStatuses] = useState([]);
  const [searchRegDate, setSearchRegDate] = useState("");
  const [searchPubDate, setSearchPubDate] = useState("");
  const [searchRegistrant, setSearchRegistrant] = useState("");
  // 검색 버튼 클릭 시 적용되는 실제 필터
  const ALL_PLATFORMS = ["twitter", "youtube", "facebook", "instagram", "threads"];
  const [appliedSearch, setAppliedSearch] = useState({ title: "", platforms: ALL_PLATFORMS, statuses: [], regDate: "", pubDate: "", registrant: "" });

  // 콘텐츠 캘린더 상태
  const [contentsCalView, setContentsCalView] = useState("month");
  const [contentsCalYear, setContentsCalYear] = useState(2026);
  const [contentsCalMonth, setContentsCalMonth] = useState(2); // 0-indexed, 2=3월
  const [contentsCalSelectedDay, setContentsCalSelectedDay] = useState(22); // 오늘 날짜
  const [contentsCalPlatforms, setContentsCalPlatforms] = useState(["twitter", "youtube", "facebook", "instagram", "threads"]);

  // 인증 상태 (Supabase Auth 연동)
  const [authState, setAuthState] = useState("loading"); // "loading" | "logged-out" | "signup" | "pending" | "approved"
  const [authForm, setAuthForm] = useState({ email: "", password: "", name: "" });
  const [authError, setAuthError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // 회원 관리
  const [membersList, setMembersList] = useState([]);

  // 홈 - 채널별 성과 검색 상태
  const [homeChannelPlatforms, setHomeChannelPlatforms] = useState(["twitter", "youtube", "facebook", "instagram", "threads"]);
  const [homeChannelStartDate, setHomeChannelStartDate] = useState("2026-03-15");
  const [homeChannelEndDate, setHomeChannelEndDate] = useState("2026-03-22");

  // 홈 - 콘텐츠별 성과 검색 상태
  const [homeContentPlatforms, setHomeContentPlatforms] = useState(["twitter", "youtube", "facebook", "instagram", "threads"]);
  const [homeContentStartDate, setHomeContentStartDate] = useState("2026-03-15");
  const [homeContentEndDate, setHomeContentEndDate] = useState("2026-03-22");
  const [homeContentTitle, setHomeContentTitle] = useState("");

  const menuItems = [
    { id: "home", label: "홈", icon: Icons.Home },
    { id: "contents", label: "콘텐츠 관리", icon: Icons.Edit },
    { id: "community", label: "커뮤니티", icon: Icons.MessageCircle },
    { id: "research", label: "리서치", icon: Icons.Search },
  ];

  const statusColors = { approved: "#10b981", draft: "#94a3b8", review: "#f59e0b" };
  const statusLabels = { approved: "승인완료", draft: "초안", review: "검토중" };
  const sentimentColors = { positive: "#10b981", negative: "#ef4444", neutral: "#94a3b8" };
  const sentimentLabels = { positive: "긍정", negative: "부정", neutral: "중립" };

  const [isGenerating, setIsGenerating] = useState(false);

  // 연동 관리 탭 상태
  const [integrationTab, setIntegrationTab] = useState("sns");
  // SNS 플랫폼 순서 (드래그 앤 드롭으로 변경, localStorage에 자동 저장)
  const [snsOrder, setSnsOrder] = useState(() => {
    const saved = localStorage.getItem("snsOrder");
    return saved ? JSON.parse(saved) : ["twitter", "youtube", "facebook", "instagram", "threads"];
  });
  const dragSnsRef = useRef(null);

  // 서비스 연동 자격증명
  const [serviceCredentials, setServiceCredentials] = useState({
    supabase:    { projectUrl: "", publishableKey: "", anonKeyLegacy: "" },
    github:      { personalAccessToken: "", owner: "", repo: "" },
    vercel:      { accessToken: "", projectId: "", orgId: "" },
    googleSheet: { spreadsheetId: "", serviceAccountEmail: "", privateKey: "" },
    openai:      { apiKey: "" },
    buffer:      { apiKey: "" },
  });
  const [serviceSaveStatus, setServiceSaveStatus] = useState({});
  // Buffer 채널 목록
  const [bufferChannels, setBufferChannels] = useState([]);

  // SNS 연동 관리 상태
  const [snsCredentials, setSnsCredentials] = useState({
    facebook:  { appId: "", appSecret: "", accessToken: "", pageId: "" },
    twitter:   { bearerToken: "", consumerKey: "", consumerKeySecret: "", accessToken: "", accessTokenSecret: "", clientId: "", clientSecret: "" },
    threads:   { appId: "", accessToken: "" },
    instagram: { accessToken: "", userId: "", facebookPageId: "" },
    youtube:   { clientId: "", clientSecret: "" },
  });
  const [snsSaveStatus, setSnsSaveStatus] = useState({}); // { facebook: "saved" | "saving" | null }
  const [showTokens, setShowTokens] = useState({});       // { "facebook-pageAccessToken": true }

  // 앱 시작 시 세션 확인 + DB에서 자격증명 로드
  useEffect(() => {
    const loadCredentials = async () => {
      // DEMO_MODE이면 세션 확인 없이 바로 승인 상태로
      if (DEMO_MODE) {
        setAuthState("approved");
      } else {
        // Supabase 세션 확인
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setAuthState("logged-out");
          return;
        }
        // members 테이블에서 승인 상태 확인
        const { data: memberData } = await supabase
          .from("members")
          .select("*")
          .eq("email", session.user.email)
          .single();
        if (!memberData || memberData.approval_status !== "approved") {
          setAuthState("pending");
          return;
        }
        setCurrentUser(memberData);
        setAuthState("approved");
      }

      const [{ data: snsData }, { data: svcData }, { data: membersData }] = await Promise.all([
        supabase.from("sns_credentials").select("platform, credentials"),
        supabase.from("service_credentials").select("service, credentials"),
        supabase.from("members").select("*").order("created_at", { ascending: true }),
      ]);

      if (membersData?.length) {
        setMembersList(membersData.map(m => ({
          id: m.id,
          name: m.name,
          email: m.email,
          joinedAt: m.joined_at,
          approvalStatus: m.approval_status,
          role: m.role,
        })));
      }

      if (snsData?.length) {
        const loaded = {};
        snsData.forEach(row => { loaded[row.platform] = row.credentials; });
        setSnsCredentials(prev => {
          const merged = { ...prev };
          Object.keys(loaded).forEach(p => {
            merged[p] = { ...prev[p], ...loaded[p] };
          });
          return merged;
        });
      }

      if (svcData?.length) {
        const loaded = {};
        svcData.forEach(row => { loaded[row.service] = row.credentials; });
        setServiceCredentials(prev => {
          const merged = { ...prev };
          Object.keys(loaded).forEach(s => {
            merged[s] = { ...prev[s], ...loaded[s] };
          });
          return merged;
        });
      }
    };

    loadCredentials();
  }, []);

  // ── Buffer API 함수들 (Supabase Edge Function 프록시 경유) ──
  // Buffer GraphQL 프록시 호출 헬퍼
  const bufferGraphQL = async (query, variables) => {
    const apiKey = serviceCredentials.buffer?.apiKey?.trim();
    if (!apiKey) throw new Error("Buffer API Key를 먼저 입력하고 저장해주세요.");
    const { data, error } = await supabase.functions.invoke("buffer-proxy", {
      body: { query, variables, apiKey },
    });
    if (error) throw new Error(error.message);
    if (data?.error) throw new Error(data.error);
    if (data?.errors) throw new Error(data.errors[0]?.message || "Buffer API 오류");
    return data;
  };

  // Buffer 연결 채널 목록 조회 (한 번의 호출로 Organization + Channels 동시 조회)
  const fetchBufferChannels = async () => {
    const apiKey = serviceCredentials.buffer?.apiKey?.trim();
    if (!apiKey) { alert("Buffer API Key를 먼저 입력하고 저장해주세요."); return; }
    try {
      const data = await bufferGraphQL(
        `query { account { organizations { id name channels { id name service } } } }`
      );
      const org = data?.data?.account?.organizations?.[0];
      if (!org) { alert("Buffer 계정에 연결된 조직을 찾을 수 없습니다.\nbuffer.com에서 채널을 먼저 연결해주세요."); return; }
      const channels = org.channels || [];
      setBufferChannels(channels);
      if (channels.length === 0) {
        alert("Buffer에 연결된 채널이 없습니다.\nbuffer.com에서 SNS 채널을 먼저 연결해주세요.");
      } else {
        alert(`✅ Buffer 채널 ${channels.length}개 확인 완료!\n\n${channels.map(c => `✅ ${c.service} — ${c.name}`).join("\n")}`);
      }
    } catch (e) {
      alert(`Buffer 연결 오류: ${e.message}`);
    }
  };

  // Buffer 서비스명 → 대시보드 플랫폼 키 매핑
  const BUFFER_SERVICE_MAP = {
    twitter: "twitter", instagram: "instagram", facebook: "facebook",
    linkedin: "linkedin", threads: "threads", tiktok: "tiktok",
    youtube: "youtube", googlebusiness: "googlebusiness",
    mastodon: "mastodon", pinterest: "pinterest",
  };

  // Buffer를 통한 발행
  const publishViaBuffer = async (text, platformKey, scheduledAt) => {
    const apiKey = serviceCredentials.buffer?.apiKey?.trim();
    if (!apiKey) throw new Error("Buffer API Key 미설정");

    // 해당 플랫폼에 매핑되는 Buffer 채널 찾기
    const channel = bufferChannels.find(c =>
      BUFFER_SERVICE_MAP[c.service] === platformKey
    );
    if (!channel) throw new Error(`Buffer에 ${PLATFORMS[platformKey]?.name || platformKey} 채널이 연결되어 있지 않습니다.\nbuffer.com에서 채널을 연결한 후 '채널 확인' 버튼을 눌러주세요.`);

    const input = {
      text,
      channelId: channel.id,
      schedulingType: "automatic",
      mode: scheduledAt ? "customScheduled" : "shareNow",
    };
    if (scheduledAt) input.dueAt = new Date(scheduledAt).toISOString();

    const data = await bufferGraphQL(
      `mutation($input: CreatePostInput!) {
        createPost(input: $input) {
          ... on PostActionSuccess { post { id text dueAt } }
          ... on MutationError { message }
        }
      }`,
      { input }
    );
    const result = data?.data?.createPost;
    if (result?.message) throw new Error(result.message);
    return result?.post;
  };

  // Buffer 사용 가능 여부 확인
  const isBufferAvailable = () =>
    serviceCredentials.buffer?.apiKey?.trim() && bufferChannels.length > 0;

  // 편집 화면 초안 자동 생성 (OpenAI API 호출)
  const handleDraftGenerate = async () => {
    if (!editingContent?.masterText?.trim()) {
      alert("마스터 글을 입력해주세요.\n마스터 글이 있어야 초안을 생성할 수 있습니다.");
      return;
    }
    if (!draftPromptEdit.content.trim()) {
      alert("프롬프트를 선택하거나 입력해주세요.\n왼쪽 목록에서 프롬프트를 선택하거나 내용을 직접 입력해주세요.");
      return;
    }
    if (draftGenPlatforms.length === 0) {
      alert("생성할 플랫폼을 하나 이상 선택해주세요.");
      return;
    }
    const apiKey = serviceCredentials.openai?.apiKey?.trim();
    if (!apiKey) {
      alert("OpenAI API 키가 없습니다.\n연동 관리 > 서비스 연동 > OpenAI에서 키를 저장해주세요.");
      return;
    }

    setIsDraftGenerating(true);

    const PLATFORM_NAMES = { twitter: "X (Twitter)", youtube: "YouTube 커뮤니티", facebook: "Facebook", instagram: "Instagram", threads: "Threads" };
    const PLATFORM_GUIDES = {
      twitter:   "140자 이내, 간결하고 임팩트 있게, 해시태그 3개 이하",
      youtube:   "200자 이내, 친근하고 상세하게, 유튜브 커뮤니티 게시글 형식",
      facebook:  "공감형·커뮤니티 친화적, 질문으로 마무리, 이모지 적절히 사용",
      instagram: "감성적·비주얼 중심, 줄바꿈 활용, 해시태그 10개 이하",
      threads:   "짧고 대화체, 200자 이내, 가볍게 읽히는 톤",
    };

    const platformList = draftGenPlatforms
      .map(p => `- ${PLATFORM_NAMES[p]}: ${PLATFORM_GUIDES[p]}`)
      .join("\n");

    const promptInstruction = draftPromptEdit.content.trim();

    const systemPrompt = `당신은 SNS 콘텐츠 전문가입니다. 주어진 마스터 글을 각 플랫폼에 맞게 재작성해주세요.

추가 지침: ${promptInstruction}

플랫폼별 요구사항:
${platformList}

응답 형식: 반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트 없이 JSON만 출력하세요.
{
  ${draftGenPlatforms.map(p => `"${p}": "해당 플랫폼용 글"`).join(",\n  ")}
}`;

    try {
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `마스터 글:\n${editingContent.masterText}` },
          ],
          temperature: 0.7,
          response_format: { type: "json_object" },
        }),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error?.message || `API 오류 ${resp.status}`);

      const raw = data.choices[0].message.content.trim();
      const jsonStr = raw.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
      const generated = JSON.parse(jsonStr);

      setEditingContent(prev => ({
        ...prev,
        platformDrafts: { ...prev.platformDrafts, ...generated },
      }));
    } catch (e) {
      alert(`초안 생성 실패: ${e.message}`);
    } finally {
      setIsDraftGenerating(false);
    }
  };

  const handleGenerate = () => {
    if (!multiUseInput.trim()) return;
    setGeneratedContent(null);
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedContent({
        instagram: {
          text: `📸 코딩 몰라도 SNS 자동화 가능합니다\n\n솔직히 매일 5개 채널에 콘텐츠 올리는 거,\n너무 귀찮지 않으셨나요? 🤦‍♀️\n\nAntigravity를 만나고 나서\n저는 이 모든 걸 자동화했습니다.\n\n✅ 로그인부터 글 작성, 발행까지 자동\n✅ 사람처럼 움직여서 차단 걱정 NO\n✅ Python 기초만 알면 바로 시작\n✅ 댓글, 조회수 수집까지 한 번에\n\n마케터가 진짜 해야 할 일은\n'반복 작업'이 아니라 '전략'이잖아요.\n\n🔗 자세한 내용은 프로필 링크에서!\n\n#Antigravity #안티그래비티 #업무자동화\n#SNS자동화 #마케팅자동화 #파이썬\n#웹자동화 #마케터필수템 #생산성`,
          charCount: 412,
          hashtags: 9,
          format: "캐러셀 10장 권장",
          tip: "첫 장에 후킹 문구, 마지막 장에 CTA 배치",
        },
        facebook: {
          text: `여러분, 혹시 매일 SNS 채널마다 같은 내용을 복붙하고 계신가요? 😅\n\n저도 그랬습니다. 인스타, 페북, X, 스레드, 유튜브... 5개 채널을 운영하면서 하루의 절반을 단순 반복 작업에 쓰고 있었어요.\n\n그러다 발견한 게 Antigravity(안티그래비티)입니다.\n\nAntigravity는 파이썬 기반의 웹 자동화 도구인데요, 기존 자동화 도구들과 다른 점이 있습니다:\n\n🔹 실제 브라우저에서 사람처럼 동작해서 봇 차단을 걱정할 필요가 없습니다\n🔹 로그인 → 글 작성 → 발행까지 전 과정을 자동화할 수 있습니다\n🔹 경쟁사 모니터링, 댓글/리뷰 수집, 성과 데이터 분석까지 가능합니다\n\n특히 마케팅 실무자라면, 콘텐츠를 한 번 만들어서 여러 채널에 자동 배포하고 성과까지 자동 수집하는 워크플로우를 만들 수 있다는 게 가장 큰 메리트입니다.\n\nPython 기초만 알면 시작할 수 있어서, 개발자가 아닌 마케터도 충분히 활용 가능합니다.\n\n👉 더 자세한 내용이 궁금하시면 댓글이나 DM 주세요!\n\n여러분은 SNS 운영에서 가장 귀찮은 작업이 뭔가요? 댓글로 알려주세요 👇`,
          charCount: 680,
          hashtags: 0,
          format: "링크 포스트 (썸네일 이미지 포함)",
          tip: "질문형 마무리로 댓글 유도 — 페북 알고리즘 반응 ↑",
        },
        twitter: {
          text: `🧵 마케터인데 아직도 SNS 5개 채널에 수동으로 올리고 계신가요?\n\nAntigravity 하나면 끝납니다.\n\n알려드릴게요 👇\n\n---\n\n1/ Antigravity는 파이썬 기반 웹 자동화 라이브러리입니다.\n\nSelenium과 다른 점?\n→ 사람처럼 브라우저를 조작해서 봇 탐지에 안 걸립니다.\n\n---\n\n2/ 마케터가 할 수 있는 것들:\n\n• 콘텐츠 자동 발행 (인스타/페북/X/스레드)\n• 경쟁사 SNS 자동 모니터링\n• 댓글·조회수·좋아요 자동 수집\n• 성과 데이터 자동 분석\n\n---\n\n3/ "나 코딩 못하는데?"\n\nPython 기초만 알면 됩니다.\nprint("hello") 칠 줄 알면 시작 가능.\n\n---\n\n4/ 핵심은 이겁니다:\n\n마케터의 시간은 '반복 작업'이 아니라\n'전략과 크리에이티브'에 써야 합니다.\n\nAntigravity = 반복 작업 제거 도구 🔥\n\n---\n\n5/ 관심 있으면 🔄 리포스트 + 팔로우\n\n다음 스레드에서 실제 자동화 코드를 공유할게요.\n\n#Antigravity #SNS자동화 #마케팅`,
          charCount: 520,
          hashtags: 3,
          format: "스레드 (5개 트윗)",
          tip: "1번 트윗에서 호기심 유발, 마지막에 CTA 배치",
        },
        threads: {
          text: `SNS 5개 채널 운영하는 마케터인데요,\n솔직히 매일 같은 글 복붙하는 거 너무 지쳤거든요.\n\n그래서 Antigravity라는 걸 써봤는데...\n이게 진짜 사람처럼 브라우저를 조작해요.\n\n로그인 → 글 작성 → 발행\n이 전체 과정이 자동.\n\n봇 차단? 사람처럼 움직여서 걸리지도 않음.\n\nPython 기초만 알면 되고,\n경쟁사 모니터링이나 댓글 수집도 가능.\n\n마케터가 반복 작업에 시간 쓰는 건\n진짜 아까운 거 아닌가요?\n\n궁금한 거 있으면 물어보세요 ✋`,
          charCount: 298,
          hashtags: 0,
          format: "텍스트 포스트",
          tip: "Threads는 해시태그 효과 낮음 — 대화체로 공감 유도",
        },
        youtube: {
          text: `📺 제목:\n코딩 몰라도 SNS 자동화? Antigravity 완전 정복 | 마케터 필수 도구\n\n📋 설명:\n마케터라면 꼭 알아야 할 SNS 자동화 도구, Antigravity를 소개합니다.\n\nSelenium, Playwright와는 차원이 다른 웹 자동화 — 사람처럼 브라우저를 조작하기 때문에 봇 탐지를 자연스럽게 통과합니다.\n\n이 영상에서 다루는 내용:\n• Antigravity가 뭔지, 왜 다른 도구와 다른지\n• 마케터가 실무에서 활용하는 구체적 사례\n• 실제 자동화 코드 시연 (따라하기 가능)\n\nPython 기초만 알면 누구나 시작할 수 있습니다.\n\n⏱ 타임스탬프:\n00:00 인트로 — SNS 운영의 고통\n01:20 Antigravity란?\n03:45 기존 도구와의 차이점\n06:10 실무 활용 사례 4가지\n09:30 라이브 코딩 시연\n13:00 마케터를 위한 꿀팁\n15:20 정리 및 다음 영상 예고\n\n🏷 태그:\nAntigravity, 안티그래비티, SNS 자동화, 웹 자동화, 파이썬 자동화, 마케팅 자동화, Selenium 대안, 업무 자동화, 마케터 도구, Python 마케팅\n\n🔔 구독과 좋아요는 큰 힘이 됩니다!`,
          charCount: 720,
          hashtags: 10,
          format: "롱폼 영상 (15~20분) + 숏츠 클립 3개",
          tip: "숏츠용 하이라이트: 봇탐지 우회 장면, 자동 발행 시연, Before/After 비교",
        },
      });
    }, 1500);
  };

  // Styles
  const styles = {
    app: {
      display: "flex",
      height: "100vh",
      fontFamily: "'Pretendard', 'Apple SD Gothic Neo', -apple-system, sans-serif",
      background: "#f8f9fc",
      color: "#1a1a2e",
      overflow: "hidden",
    },
    sidebar: {
      width: sidebarCollapsed ? 64 : 220,
      background: "linear-gradient(195deg, #0f0f23 0%, #1a1a3e 100%)",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
      flexShrink: 0,
      overflow: "hidden",
    },
    logo: {
      padding: sidebarCollapsed ? "20px 12px" : "20px 20px",
      borderBottom: "1px solid #ffffff12",
      display: "flex",
      alignItems: "center",
      gap: 10,
      cursor: "pointer",
      whiteSpace: "nowrap",
    },
    menuItem: (active) => ({
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: sidebarCollapsed ? "12px 20px" : "11px 20px",
      cursor: "pointer",
      background: active ? "linear-gradient(90deg, #6366f120, #6366f108)" : "transparent",
      borderLeft: active ? "3px solid #818cf8" : "3px solid transparent",
      color: active ? "#c7d2fe" : "#94a3b8",
      fontSize: 14,
      fontWeight: active ? 600 : 400,
      transition: "all 0.2s",
      whiteSpace: "nowrap",
      overflow: "hidden",
    }),
    main: {
      flex: 1,
      overflow: "auto",
      padding: "28px 32px",
    },
    pageTitle: {
      fontSize: 22,
      fontWeight: 700,
      marginBottom: 6,
      color: "#0f0f23",
      letterSpacing: "-0.02em",
    },
    pageSubtitle: {
      fontSize: 13,
      color: "#64748b",
      marginBottom: 24,
    },
    card: {
      background: "#fff",
      borderRadius: 14,
      padding: "22px 24px",
      boxShadow: "0 1px 3px #0000000a, 0 1px 2px #0000000f",
      border: "1px solid #e8eaf0",
    },
    cardTitle: {
      fontSize: 14,
      fontWeight: 600,
      color: "#374151",
      marginBottom: 16,
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
    grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 },
    grid4: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 },
    btn: (primary) => ({
      padding: "9px 18px",
      borderRadius: 8,
      border: primary ? "none" : "1px solid #d1d5db",
      background: primary ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#fff",
      color: primary ? "#fff" : "#374151",
      fontSize: 13,
      fontWeight: 500,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      transition: "all 0.2s",
    }),
    btnSm: (primary) => ({
      padding: "5px 12px",
      borderRadius: 6,
      border: primary ? "none" : "1px solid #d1d5db",
      background: primary ? "#6366f1" : "#fff",
      color: primary ? "#fff" : "#374151",
      fontSize: 12,
      fontWeight: 500,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
    }),
    input: {
      width: "100%",
      padding: "10px 14px",
      borderRadius: 8,
      border: "1px solid #d1d5db",
      fontSize: 13,
      outline: "none",
      fontFamily: "inherit",
      boxSizing: "border-box",
    },
    textarea: {
      width: "100%",
      padding: "12px 14px",
      borderRadius: 10,
      border: "1px solid #d1d5db",
      fontSize: 13,
      outline: "none",
      fontFamily: "inherit",
      resize: "vertical",
      minHeight: 120,
      boxSizing: "border-box",
      lineHeight: 1.6,
    },
    badge: (color) => ({
      display: "inline-flex",
      alignItems: "center",
      padding: "3px 10px",
      borderRadius: 100,
      fontSize: 11,
      fontWeight: 600,
      background: color + "18",
      color: color,
    }),
    tag: {
      display: "inline-flex",
      alignItems: "center",
      padding: "4px 10px",
      borderRadius: 6,
      fontSize: 11,
      fontWeight: 500,
      background: "#f1f5f9",
      color: "#475569",
      gap: 4,
    },
    platformDot: (color) => ({
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: color,
      flexShrink: 0,
    }),
    tabBar: {
      display: "flex",
      gap: 2,
      background: "#f1f5f9",
      borderRadius: 10,
      padding: 3,
      marginBottom: 20,
    },
    tab: (active) => ({
      padding: "8px 16px",
      borderRadius: 8,
      fontSize: 13,
      fontWeight: active ? 600 : 400,
      color: active ? "#1a1a2e" : "#64748b",
      background: active ? "#fff" : "transparent",
      border: "none",
      cursor: "pointer",
      boxShadow: active ? "0 1px 3px #0000000d" : "none",
      transition: "all 0.2s",
    }),
  };

  // ========================
  //  PAGE: HOME
  // ========================
  const renderHome = () => {
    // 채널별 성과 필터링
    const channelRows = Object.entries(MOCK_CHANNEL_STATS).filter(([p]) => homeChannelPlatforms.includes(p));

    // 콘텐츠별 성과: 동일 제목으로 집계 (플랫폼 필터 적용)
    const contentGrouped = MOCK_CONTENT_STATS
      .filter(r => homeContentPlatforms.includes(r.platform))
      .filter(r => !homeContentTitle.trim() || r.title.includes(homeContentTitle.trim()))
      .reduce((acc, r) => {
        const existing = acc.find(x => x.title === r.title);
        if (existing) {
          existing.platforms.push(r.platform);
          existing.views    += r.views;
          existing.likes    += r.likes;
          existing.comments += r.comments;
          existing.shares   += r.shares;
          existing.saves    += r.saves;
        } else {
          acc.push({ title: r.title, platforms: [r.platform], views: r.views, likes: r.likes, comments: r.comments, shares: r.shares, saves: r.saves });
        }
        return acc;
      }, []);

    const metricsTh = { padding: "10px 14px", fontSize: 12, fontWeight: 600, color: "#64748b", textAlign: "right", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" };
    const metricsThNo = { ...metricsTh, textAlign: "center", width: 48 };
    const metricsTd = { padding: "10px 14px", fontSize: 13, textAlign: "right", borderBottom: "1px solid #f1f5f9" };
    const metricsTdNo = { ...metricsTd, textAlign: "center", color: "#94a3b8", fontWeight: 500 };

    // 채널별 차트 데이터
    const channelChartLabels = channelRows.map(([key]) => PLATFORMS[key].name);
    const channelChartSeries = [
      { name: "조회",    data: channelRows.map(([,s]) => s.views) },
      { name: "좋아요",  data: channelRows.map(([,s]) => s.likes) },
      { name: "댓글",    data: channelRows.map(([,s]) => s.comments) },
      { name: "공유하기", data: channelRows.map(([,s]) => s.shares) },
      { name: "저장",    data: channelRows.map(([,s]) => s.saves) },
    ];

    // 콘텐츠별 차트 데이터 (x축은 No. 번호)
    const contentChartLabels = contentGrouped.map((_, i) => `No.${i + 1}`);
    const contentChartSeries = [
      { name: "조회",    data: contentGrouped.map(r => r.views) },
      { name: "좋아요",  data: contentGrouped.map(r => r.likes) },
      { name: "댓글",    data: contentGrouped.map(r => r.comments) },
      { name: "공유하기", data: contentGrouped.map(r => r.shares) },
      { name: "저장",    data: contentGrouped.map(r => r.saves) },
    ];

    return (
      <div>
        {/* 채널별 성과 */}
        <div style={{ ...styles.card, marginBottom: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", marginBottom: 16 }}>📊 채널별 성과</div>

          {/* 검색 조건 */}
          <div style={{ background: "#f8fafc", borderRadius: 10, padding: "16px 20px", marginBottom: 16, border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#374151", minWidth: 56 }}>플랫폼</span>
              {Object.entries(PLATFORMS).map(([key, p]) => {
                const on = homeChannelPlatforms.includes(key);
                return (
                  <button key={key} onClick={() => setHomeChannelPlatforms(prev => on ? prev.filter(x => x !== key) : [...prev, key])}
                    style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: "pointer", border: `1px solid ${on ? p.color : "#d1d5db"}`, background: on ? p.color : "#fff", color: on ? "#fff" : "#374151", transition: "all 0.15s" }}>
                    {p.icon} {p.name}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#374151", minWidth: 56 }}>조회 기간</span>
              <input type="date" value={homeChannelStartDate} onChange={e => setHomeChannelStartDate(e.target.value)}
                style={{ border: "1px solid #d1d5db", borderRadius: 6, padding: "5px 10px", fontSize: 13 }} />
              <span style={{ fontSize: 13, color: "#64748b" }}>~</span>
              <input type="date" value={homeChannelEndDate} onChange={e => setHomeChannelEndDate(e.target.value)}
                style={{ border: "1px solid #d1d5db", borderRadius: 6, padding: "5px 10px", fontSize: 13 }} />
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <button
                  onClick={() => { setHomeChannelPlatforms(["twitter","youtube","facebook","instagram","threads"]); setHomeChannelStartDate("2026-03-15"); setHomeChannelEndDate("2026-03-22"); }}
                  style={{ padding: "6px 16px", border: "1px solid #d1d5db", borderRadius: 6, background: "#fff", fontSize: 13, cursor: "pointer" }}
                >초기화</button>
                <button style={{ padding: "6px 16px", border: "none", borderRadius: 6, background: "#6366f1", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>검색</button>
              </div>
            </div>
          </div>

          {/* 채널별 테이블 */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={metricsThNo}>No</th>
                  <th style={{ ...metricsTh, textAlign: "left" }}>채널</th>
                  <th style={metricsTh}>조회</th>
                  <th style={metricsTh}>좋아요</th>
                  <th style={metricsTh}>댓글</th>
                  <th style={metricsTh}>공유하기</th>
                  <th style={metricsTh}>저장</th>
                </tr>
              </thead>
              <tbody>
                {channelRows.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: "center", padding: 32, color: "#94a3b8", fontSize: 13 }}>조회 결과가 없습니다</td></tr>
                ) : channelRows.map(([key, stat], i) => (
                  <tr key={key}>
                    <td style={metricsTdNo}>{i + 1}</td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid #f1f5f9" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <span style={{ color: PLATFORMS[key].color }}>{PLATFORMS[key].icon}</span>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{PLATFORMS[key].name}</span>
                      </span>
                    </td>
                    <td style={metricsTd}>{stat.views.toLocaleString()}</td>
                    <td style={metricsTd}>{stat.likes.toLocaleString()}</td>
                    <td style={metricsTd}>{stat.comments.toLocaleString()}</td>
                    <td style={metricsTd}>{stat.shares.toLocaleString()}</td>
                    <td style={metricsTd}>{stat.saves > 0 ? stat.saves.toLocaleString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 채널별 선 그래프 */}
          {channelRows.length > 0 && (
            <MetricsLineChart labels={channelChartLabels} series={channelChartSeries} height={200} />
          )}
        </div>

        {/* 콘텐츠별 성과 */}
        <div style={styles.card}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", marginBottom: 16 }}>📋 콘텐츠별 성과</div>

          {/* 검색 조건 */}
          <div style={{ background: "#f8fafc", borderRadius: 10, padding: "16px 20px", marginBottom: 16, border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#374151", minWidth: 56 }}>플랫폼</span>
              {Object.entries(PLATFORMS).map(([key, p]) => {
                const on = homeContentPlatforms.includes(key);
                return (
                  <button key={key} onClick={() => setHomeContentPlatforms(prev => on ? prev.filter(x => x !== key) : [...prev, key])}
                    style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: "pointer", border: `1px solid ${on ? p.color : "#d1d5db"}`, background: on ? p.color : "#fff", color: on ? "#fff" : "#374151", transition: "all 0.15s" }}>
                    {p.icon} {p.name}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#374151", minWidth: 56 }}>조회 기간</span>
              <input type="date" value={homeContentStartDate} onChange={e => setHomeContentStartDate(e.target.value)}
                style={{ border: "1px solid #d1d5db", borderRadius: 6, padding: "5px 10px", fontSize: 13 }} />
              <span style={{ fontSize: 13, color: "#64748b" }}>~</span>
              <input type="date" value={homeContentEndDate} onChange={e => setHomeContentEndDate(e.target.value)}
                style={{ border: "1px solid #d1d5db", borderRadius: 6, padding: "5px 10px", fontSize: 13 }} />
              <input
                type="text"
                placeholder="콘텐츠 제목 검색"
                value={homeContentTitle}
                onChange={e => setHomeContentTitle(e.target.value)}
                style={{ border: "1px solid #d1d5db", borderRadius: 6, padding: "5px 10px", fontSize: 13, width: 180 }}
              />
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <button
                  onClick={() => { setHomeContentPlatforms(["twitter","youtube","facebook","instagram","threads"]); setHomeContentStartDate("2026-03-15"); setHomeContentEndDate("2026-03-22"); setHomeContentTitle(""); }}
                  style={{ padding: "6px 16px", border: "1px solid #d1d5db", borderRadius: 6, background: "#fff", fontSize: 13, cursor: "pointer" }}
                >초기화</button>
                <button style={{ padding: "6px 16px", border: "none", borderRadius: 6, background: "#6366f1", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>검색</button>
              </div>
            </div>
          </div>

          {/* 콘텐츠별 테이블 */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={metricsThNo}>No</th>
                  <th style={{ ...metricsTh, textAlign: "left" }}>콘텐츠 제목</th>
                  <th style={{ ...metricsTh, textAlign: "left" }}>채널</th>
                  <th style={metricsTh}>조회</th>
                  <th style={metricsTh}>좋아요</th>
                  <th style={metricsTh}>댓글</th>
                  <th style={metricsTh}>공유하기</th>
                  <th style={metricsTh}>저장</th>
                </tr>
              </thead>
              <tbody>
                {contentGrouped.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: "center", padding: 32, color: "#94a3b8", fontSize: 13 }}>조회 결과가 없습니다</td></tr>
                ) : contentGrouped.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={metricsTdNo}>{i + 1}</td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid #f1f5f9", fontSize: 13 }}>{row.title}</td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid #f1f5f9" }}>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {row.platforms.map(p => (
                          <span key={p} title={PLATFORMS[p].name} style={{ color: PLATFORMS[p].color, fontSize: 15 }}>{PLATFORMS[p].icon}</span>
                        ))}
                      </div>
                    </td>
                    <td style={metricsTd}>{row.views.toLocaleString()}</td>
                    <td style={metricsTd}>{row.likes.toLocaleString()}</td>
                    <td style={metricsTd}>{row.comments.toLocaleString()}</td>
                    <td style={metricsTd}>{row.shares.toLocaleString()}</td>
                    <td style={metricsTd}>{row.saves > 0 ? row.saves.toLocaleString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 콘텐츠별 선 그래프 (x축: No. 번호) */}
          {contentGrouped.length > 0 && (
            <MetricsLineChart labels={contentChartLabels} series={contentChartSeries} height={200} />
          )}
        </div>
      </div>
    );
  };

  // ========================
  //  PAGE: RESEARCH
  // ========================
  const renderResearch = () => (
    <div>
      <div style={styles.pageTitle}>리서치 & 기획</div>
      <div style={styles.pageSubtitle}>경쟁사 벤치마킹, 트렌드 탐색, 레퍼런스 수집</div>

      {/* Benchmark Tool */}
      <div style={{ ...styles.card, marginBottom: 20 }}>
        <div style={styles.cardTitle}>🔍 경쟁사 벤치마킹 분석</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <input
            style={{ ...styles.input, flex: 1 }}
            placeholder="분석할 SNS 계정 URL을 입력하세요 (예: instagram.com/brandname)"
            value={benchmarkUrl}
            onChange={(e) => setBenchmarkUrl(e.target.value)}
          />
          <button style={styles.btn(true)} onClick={() => setShowBenchmarkResult(true)}>
            <Icons.Search /> 분석하기
          </button>
        </div>

        {showBenchmarkResult && (
          <div style={{ background: "#f8fafc", borderRadius: 10, padding: 20, border: "1px solid #e8eaf0" }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, color: "#6366f1" }}>📋 분석 결과 — @competitor_brand</div>
            <div style={styles.grid3}>
              <div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>콘텐츠 유형 비중</div>
                <div style={{ fontSize: 13 }}>교육형 45% · 프로모션 30% · UGC 25%</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>주력 포맷</div>
                <div style={{ fontSize: 13 }}>캐러셀 (인게이지먼트 2.3배 ↑)</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>게시 패턴</div>
                <div style={{ fontSize: 13 }}>주 5회 · 주로 화/목/토 오후 7시</div>
              </div>
            </div>
            <div style={{ marginTop: 14, padding: "12px 14px", background: "#ede9fe", borderRadius: 8, fontSize: 13, color: "#5b21b6", lineHeight: 1.6 }}>
              💡 <strong>AI 인사이트:</strong> 이 계정은 교육형 캐러셀 콘텐츠에서 가장 높은 인게이지먼트를 보입니다. 해시태그는 니치 태그(팔로워 1만~10만 규모)를 주로 활용하여 도달률을 높이고 있습니다. 톤앤매너는 친근하고 전문적인 균형을 유지합니다.
            </div>
          </div>
        )}
      </div>

      <div style={styles.grid2}>
        {/* Trends */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>🔥 트렌드 키워드</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {MOCK_TRENDS.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: 8, background: "#f8fafc" }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{t.keyword}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: "#64748b" }}>{t.volume}</span>
                  <span style={styles.badge(t.status === "급상승" ? "#ef4444" : t.status === "상승" ? "#10b981" : t.status === "하락" ? "#94a3b8" : "#64748b")}>{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competitor Table */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>📊 경쟁사 비교</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e8eaf0" }}>
                {["계정", "팔로워", "게시빈도", "주력포맷", "인게이지먼트"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 6px", fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_COMPETITORS.map((c, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "10px 6px", fontWeight: 500 }}>{c.name}</td>
                  <td style={{ padding: "10px 6px" }}>{c.followers}</td>
                  <td style={{ padding: "10px 6px" }}>{c.postFreq}</td>
                  <td style={{ padding: "10px 6px" }}><span style={styles.tag}>{c.topFormat}</span></td>
                  <td style={{ padding: "10px 6px", fontWeight: 600, color: "#6366f1" }}>{c.engageRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ========================
  //  PAGE: CALENDAR
  // ========================
  const renderCalendar = () => {
    const daysInMonth = 31;
    const firstDay = 6; // March 2026 starts on Sunday (0-indexed: 0=Sun)
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={styles.pageTitle}>콘텐츠 캘린더</div>
          <button style={styles.btn(true)}><Icons.Plus /> 일정 추가</button>
        </div>
        <div style={styles.pageSubtitle}>{calendarMonth} · 콘텐츠 게시 일정을 관리하세요</div>

        <div style={styles.card}>
          {/* Calendar header */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0, marginBottom: 8 }}>
            {["일", "월", "화", "수", "목", "금", "토"].map(d => (
              <div key={d} style={{ textAlign: "center", fontSize: 12, fontWeight: 600, color: "#94a3b8", padding: "8px 0" }}>{d}</div>
            ))}
          </div>
          {/* Calendar grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
            {days.map((day, i) => {
              const events = day ? MOCK_CALENDAR.filter(e => e.day === day) : [];
              const isToday = day === 9;
              return (
                <div key={i} style={{
                  minHeight: 90,
                  padding: "6px 8px",
                  borderRadius: 8,
                  background: isToday ? "#ede9fe" : day ? "#fafbfd" : "transparent",
                  border: isToday ? "2px solid #8b5cf6" : day ? "1px solid #f1f5f9" : "none",
                }}>
                  {day && (
                    <>
                      <div style={{ fontSize: 12, fontWeight: isToday ? 700 : 400, color: isToday ? "#6366f1" : "#64748b", marginBottom: 4 }}>{day}</div>
                      {events.map((ev, j) => (
                        <div key={j} style={{
                          fontSize: 10,
                          padding: "3px 6px",
                          borderRadius: 4,
                          marginBottom: 2,
                          background: PLATFORMS[ev.platform].bg,
                          borderLeft: `3px solid ${PLATFORMS[ev.platform].color}`,
                          color: "#374151",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          cursor: "pointer",
                        }}>
                          {ev.title}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Season Events */}
        <div style={{ ...styles.card, marginTop: 16 }}>
          <div style={styles.cardTitle}>🎯 시즌 이벤트 알림</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { date: "3/14", event: "화이트데이", color: "#ec4899" },
              { date: "4/5", event: "식목일", color: "#22c55e" },
              { date: "5/5", event: "어린이날", color: "#f59e0b" },
              { date: "5/8", event: "어버이날", color: "#ef4444" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "10px 16px", borderRadius: 10, background: s.color + "10", border: `1px solid ${s.color}30`, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: s.color }}>{s.date}</span>
                <span style={{ fontSize: 13 }}>{s.event}</span>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>콘텐츠 준비 권장</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ========================
  //  PAGE: CONTENTS (콘텐츠 관리 — 통합)
  // ========================
  const renderContents = () => {
    const STATUS_LABELS = { draft: "초안", review: "검토중", scheduled: "예약", published: "발행완료" };
    const STATUS_COLORS = { draft: "#94a3b8", review: "#f59e0b", scheduled: "#6366f1", published: "#10b981" };

    // AI 도구 인라인 편집 핸들러
    const saveAiTool = () => {
      if (!aiToolEditData.label.trim() || !aiToolEditData.url.trim()) return;
      const updated = aiToolEditMode === "add"
        ? [...aiTools, aiToolEditData]
        : aiTools.map((t, i) => i === aiToolEditMode ? aiToolEditData : t);
      saveAiToolsToDb(updated);
      setAiToolEditMode(null);
      setAiToolEditData({ icon: "", label: "", url: "", desc: "" });
    };
    const deleteAiTool = (index) => {
      const updated = aiTools.filter((_, i) => i !== index);
      saveAiToolsToDb(updated);
    };

    // 편집 화면 하단 플랫폼 카드 드래그 핸들러
    const handleDraftDragStart = (id) => { draftPlatformDragRef.current = id; };
    const handleDraftDragOver = (e) => { e.preventDefault(); };
    const handleDraftDrop = (targetId) => {
      const draggedId = draftPlatformDragRef.current;
      if (!draggedId || draggedId === targetId) return;
      setDraftPlatformOrder(prev => {
        const next = [...prev];
        const from = next.indexOf(draggedId);
        const to = next.indexOf(targetId);
        next.splice(from, 1);
        next.splice(to, 0, draggedId);
        localStorage.setItem("draftPlatformOrder", JSON.stringify(next));
        return next;
      });
      draftPlatformDragRef.current = null;
    };

    // ── 편집 뷰 ──────────────────────────────────
    if (contentsView === "edit" && editingContent) {
      const content = editingContent;
      const updateContent = (field, value) => setEditingContent(prev => ({ ...prev, [field]: value }));
      const updateDraft = (platform, value) => setEditingContent(prev => ({
        ...prev,
        platformDrafts: { ...prev.platformDrafts, [platform]: value },
      }));
      const togglePlatform = (p) => {
        const next = content.platforms.includes(p)
          ? content.platforms.filter(x => x !== p)
          : [...content.platforms, p];
        updateContent("platforms", next);
      };
      const handleSaveContent = async (statusOverride) => {
        const toSave = { ...content, ...(statusOverride ? { status: statusOverride } : {}) };

        // 즉시 발행 또는 예약 발행
        if (statusOverride === "published" || statusOverride === "scheduled_publish") {
          const results = {};
          const useBuffer = isBufferAvailable();
          const scheduledTime = statusOverride === "scheduled_publish" ? toSave.scheduledAt : null;

          // 발행할 상태 설정
          if (statusOverride === "scheduled_publish") {
            if (!toSave.scheduledAt) { alert("예약 발행 시간을 설정해주세요."); return; }
            toSave.status = "scheduled";
          } else {
            toSave.status = "published";
          }

          // 발행 대상 플랫폼 순회
          for (const platformKey of toSave.platforms || []) {
            const draftText = toSave.platformDrafts?.[platformKey]?.trim();
            if (!draftText) {
              alert(`${PLATFORMS[platformKey]?.name || platformKey} 글을 입력해주세요.`);
              return;
            }

            // ── Buffer 우선 발행 ──
            if (useBuffer) {
              try {
                const post = await publishViaBuffer(draftText, platformKey, scheduledTime);
                const dateStr = new Date().toLocaleDateString("ko-KR");
                const mode = scheduledTime ? "예약완료" : "발행완료";
                results[platformKey] = `${mode} (Buffer) ${dateStr} | ${post?.id || ""}`;
                alert(`✅ ${PLATFORMS[platformKey]?.name} ${mode}! (Buffer)\n${scheduledTime ? `예약: ${scheduledTime}` : `Post ID: ${post?.id}`}`);
              } catch (e) {
                results[platformKey] = `오류: ${e.message}`;
                alert(`❌ ${PLATFORMS[platformKey]?.name} Buffer 발행 실패: ${e.message}`);
              }
              continue;
            }

            // ── 기존 개별 API 폴백 ──
            if (platformKey === "twitter") {
              try {
                const { data, error } = await supabase.functions.invoke("post-x", {
                  body: { text: draftText },
                });
                if (error) throw new Error(error.message);
                if (data?.success) {
                  results.twitter = `발행완료 ${new Date().toLocaleDateString("ko-KR")} | ${data.url}`;
                  alert(`✅ X 발행 완료!\n${data.url}`);
                } else {
                  results.twitter = `오류: ${data?.error}`;
                  alert(`❌ X 발행 실패: ${data?.error}`);
                }
              } catch (e) {
                results.twitter = `오류: ${e.message}`;
                alert(`❌ X 발행 오류: ${e.message}`);
              }
            } else if (platformKey === "facebook") {
              const fb = snsCredentials.facebook;
              if (!fb?.accessToken?.trim() || !fb?.pageId?.trim()) {
                alert("Facebook: 연동 관리에서 액세스 토큰/페이지 ID를 설정하거나,\nBuffer 연동을 사용해주세요.");
                return;
              }
              try {
                const resp = await fetch(`https://graph.facebook.com/v19.0/${fb.pageId}/feed`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ message: draftText, access_token: fb.accessToken }),
                });
                const data = await resp.json();
                if (data.id) {
                  results.facebook = `발행완료 ${new Date().toLocaleDateString("ko-KR")} | ${data.id}`;
                  alert(`✅ Facebook 발행 완료!\n게시글 ID: ${data.id}`);
                } else {
                  const msg = data.error?.message || JSON.stringify(data);
                  results.facebook = `오류: ${msg}`;
                  alert(`❌ Facebook 발행 실패: ${msg}`);
                }
              } catch (e) {
                results.facebook = `오류: ${e.message}`;
                alert(`❌ Facebook 발행 오류: ${e.message}`);
              }
            } else if (platformKey === "instagram") {
              const ig = snsCredentials.instagram;
              if (!ig?.accessToken?.trim() || !ig?.userId?.trim()) {
                alert("Instagram: 연동 관리에서 인증 정보를 설정하거나,\nBuffer 연동을 사용해주세요.");
                return;
              }
              const igImageUrl = (toSave.platformDrafts?.instagram_image_url || "").trim();
              if (!igImageUrl) { alert("Instagram은 이미지가 필수입니다.\n(Buffer 연동 시 텍스트만으로 발행 가능)"); return; }
              try {
                const containerResp = await fetch(`https://graph.facebook.com/v19.0/${ig.userId}/media`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ image_url: igImageUrl, caption: draftText, access_token: ig.accessToken }),
                });
                const containerData = await containerResp.json();
                if (!containerData.id) {
                  results.instagram = `오류: ${containerData.error?.message || JSON.stringify(containerData)}`;
                  alert(`❌ Instagram 미디어 생성 실패`);
                } else {
                  const publishResp = await fetch(`https://graph.facebook.com/v19.0/${ig.userId}/media_publish`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ creation_id: containerData.id, access_token: ig.accessToken }),
                  });
                  const publishData = await publishResp.json();
                  if (publishData.id) {
                    results.instagram = `발행완료 ${new Date().toLocaleDateString("ko-KR")} | ${publishData.id}`;
                    alert(`✅ Instagram 발행 완료!`);
                  } else {
                    results.instagram = `오류: ${publishData.error?.message}`;
                    alert(`❌ Instagram 발행 실패`);
                  }
                }
              } catch (e) {
                results.instagram = `오류: ${e.message}`;
                alert(`❌ Instagram 발행 오류: ${e.message}`);
              }
            } else {
              // threads, youtube 등 Buffer 미사용 시 미지원 안내
              results[platformKey] = `미지원: Buffer 연동을 사용해주세요`;
              alert(`${PLATFORMS[platformKey]?.name || platformKey}: 직접 API 미지원.\nBuffer 연동을 사용하면 발행할 수 있습니다.`);
            }
          }

          toSave.publishResults = { ...toSave.publishResults, ...results };

          // 최초 발행일 / 수정일 자동 기록
          const now = new Date().toISOString().replace("T", " ").slice(0, 16);
          if (!toSave.firstPublishedAt) {
            toSave.firstPublishedAt = now;
          } else {
            toSave.updatedAt = now;
          }
        }

        if (!toSave.id) {
          const { data, error } = await supabase.from("contents").insert(contentToDb(toSave)).select().single();
          if (error) { alert("저장 오류: " + error.message); return; }
          setContentsList(prev => [dbToContent(data), ...prev]);
        } else {
          const { error } = await supabase.from("contents").update(contentToDb(toSave)).eq("id", toSave.id);
          if (error) { alert("저장 오류: " + error.message); return; }
          setContentsList(prev => prev.map(c => c.id === toSave.id ? toSave : c));
        }
        setContentsView("list");
      };

      return (
        <div>
          {/* 편집 헤더 */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <button style={{ ...styles.btnSm(false), padding: "8px 16px" }} onClick={() => setContentsView("list")}>
              ← 목록
            </button>
            <div style={styles.pageTitle}>{content.id ? "콘텐츠 편집" : "새 콘텐츠"}</div>
          </div>

          {/* 제목 */}
          <div style={{ ...styles.card, marginBottom: 16 }}>
            <input
              style={{ ...styles.input, fontSize: 16, fontWeight: 600, border: "none", padding: "4px 0", background: "transparent", boxSizing: "border-box" }}
              placeholder="제목을 입력하세요 (예: 신제품 런칭 공지)"
              value={content.title}
              onChange={e => updateContent("title", e.target.value)}
            />
          </div>

          {/* ─── 마스터 글 + AI 도구 바로가기 ─── */}
          <div style={{ ...styles.card, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
              <div style={styles.cardTitle}>✍️ 마스터 글 & AI 작성 도구</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
              {/* 왼쪽: 마스터 글 */}
              <div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>원본 내용을 자유롭게 작성하세요. 이걸 기반으로 각 SNS용 초안을 자동 생성할 수 있습니다.</div>
                <textarea
                  style={{ ...styles.textarea, minHeight: 180 }}
                  placeholder="블로그 포스트, 보도자료, 제품 설명 등 어떤 형태든 괜찮습니다."
                  value={content.masterText}
                  onChange={e => updateContent("masterText", e.target.value)}
                />
              </div>
              {/* 오른쪽: AI 작성 도구 바로가기 */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>🔗 AI 작성 도구 바로가기</div>
                  <button
                    style={{ ...styles.btnSm(aiToolEditMode === "add"), fontSize: 11 }}
                    onClick={() => {
                      if (aiToolEditMode === "add") { setAiToolEditMode(null); }
                      else { setAiToolEditMode("add"); setAiToolEditData({ icon: "🔧", label: "", url: "", desc: "" }); }
                    }}
                  >
                    {aiToolEditMode === "add" ? "취소" : "+ 추가"}
                  </button>
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10 }}>외부 AI 도구에서 글·이미지·영상을 만들고 아래 SNS 카드에 붙여넣으세요.</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: aiToolEditMode !== null ? 14 : 0 }}>
                  {aiTools.map((tool, i) => (
                    <div key={i} style={{ position: "relative" }}>
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex", alignItems: "center", gap: 8,
                          padding: "10px 12px", paddingRight: 40, borderRadius: 8,
                          background: aiToolEditMode === i ? "#ede9fe" : "#f8fafc",
                          border: `1px solid ${aiToolEditMode === i ? "#c7d2fe" : "#e8eaf0"}`,
                          textDecoration: "none", color: "#374151",
                          fontSize: 12, fontWeight: 500, transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { if (aiToolEditMode !== i) e.currentTarget.style.background = "#f1f5f9"; }}
                        onMouseLeave={e => { if (aiToolEditMode !== i) e.currentTarget.style.background = "#f8fafc"; }}
                      >
                        <span style={{ fontSize: 18, flexShrink: 0 }}>{tool.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tool.label}</div>
                          <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 1 }}>{tool.desc}</div>
                        </div>
                      </a>
                      <button
                        style={{ position: "absolute", top: 8, right: 6, padding: "2px 5px", fontSize: 10, borderRadius: 4, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", color: "#6366f1" }}
                        onClick={e => { e.preventDefault(); setAiToolEditMode(i); setAiToolEditData({ ...tool }); }}
                      >수정</button>
                    </div>
                  ))}
                </div>
                {aiToolEditMode !== null && (
                  <div style={{ padding: 14, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                      {aiToolEditMode === "add" ? "도구 추가" : "도구 수정"}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 8, marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>이모지</div>
                        <input
                          style={{ ...styles.input, textAlign: "center", fontSize: 20, padding: "6px" }}
                          placeholder="🔧"
                          value={aiToolEditData.icon}
                          onChange={e => setAiToolEditData(prev => ({ ...prev, icon: e.target.value }))}
                        />
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>서비스명</div>
                        <input
                          style={styles.input}
                          placeholder="예: ChatGPT로 작성"
                          value={aiToolEditData.label}
                          onChange={e => setAiToolEditData(prev => ({ ...prev, label: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>이동 링크 (URL)</div>
                      <input
                        style={styles.input}
                        placeholder="https://..."
                        value={aiToolEditData.url}
                        onChange={e => setAiToolEditData(prev => ({ ...prev, url: e.target.value }))}
                      />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>서비스 설명</div>
                      <input
                        style={styles.input}
                        placeholder="예: 내 GPTs 활용"
                        value={aiToolEditData.desc}
                        onChange={e => setAiToolEditData(prev => ({ ...prev, desc: e.target.value }))}
                      />
                    </div>
                    <div style={{ display: "flex", gap: 6, justifyContent: "space-between" }}>
                      <div>
                        {aiToolEditMode !== "add" && (
                          <button
                            style={{ ...styles.btnSm(false), color: "#ef4444", borderColor: "#fecaca" }}
                            onClick={() => { deleteAiTool(aiToolEditMode); setAiToolEditMode(null); }}
                          >삭제</button>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button style={styles.btnSm(false)} onClick={() => setAiToolEditMode(null)}>취소</button>
                        <button style={styles.btnSm(true)} onClick={saveAiTool}>저장</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─── 초안 자동 생성 ─── */}
          <div style={{ ...styles.card, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
              <div style={styles.cardTitle}>✨ 초안 자동 생성</div>
              <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: 8 }}>마스터 글을 기반으로 각 SNS에 맞는 초안을 자동으로 작성합니다.</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 0, alignItems: "stretch", border: "1px solid #e8eaf0", borderRadius: 10, overflow: "hidden" }}>

              {/* 왼쪽: 프롬프트 목록 */}
              <div style={{ borderRight: "1px solid #e8eaf0", background: "#f8fafc" }}>
                <div style={{ padding: "12px 14px", borderBottom: "1px solid #e8eaf0" }}>
                  <button
                    style={{
                      width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px dashed #c7d2fe",
                      background: selectedPromptId === "new" ? "#ede9fe" : "#fff",
                      color: "#6366f1", fontSize: 12, fontWeight: 600, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}
                    onClick={() => { setSelectedPromptId("new"); setDraftPromptEdit({ title: "", content: "" }); }}
                  >
                    + 새 프롬프트 만들기
                  </button>
                </div>
                <div style={{ overflowY: "auto", maxHeight: 340 }}>
                  {draftPrompts.length === 0 ? (
                    <div style={{ padding: "24px 14px", fontSize: 11, color: "#94a3b8", textAlign: "center" }}>
                      저장된 프롬프트가 없습니다.
                    </div>
                  ) : (
                    draftPrompts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => { setSelectedPromptId(p.id); setDraftPromptEdit({ title: p.title, content: p.content }); }}
                        style={{
                          padding: "12px 14px", cursor: "pointer", borderBottom: "1px solid #e8eaf0",
                          background: selectedPromptId === p.id ? "#ede9fe" : "transparent",
                          borderLeft: selectedPromptId === p.id ? "3px solid #6366f1" : "3px solid transparent",
                          transition: "all 0.12s",
                        }}
                        onMouseEnter={e => { if (selectedPromptId !== p.id) e.currentTarget.style.background = "#f1f5f9"; }}
                        onMouseLeave={e => { if (selectedPromptId !== p.id) e.currentTarget.style.background = "transparent"; }}
                      >
                        <div style={{ fontSize: 12, fontWeight: 600, color: selectedPromptId === p.id ? "#4f46e5" : "#374151", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.content}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 오른쪽: 편집 + 생성 */}
              <div style={{ padding: 20 }}>
                {selectedPromptId === null ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 200, color: "#94a3b8", fontSize: 13 }}>
                    왼쪽에서 프롬프트를 선택하거나 새로 만드세요.
                  </div>
                ) : (
                  <>
                    {/* 제목 + 버튼 */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
                        {selectedPromptId === "new" ? "새 프롬프트" : "프롬프트 수정"}
                      </div>
                      <div style={{ flex: 1 }} />
                      {selectedPromptId !== "new" && (
                        <button
                          style={{ ...styles.btnSm(false), color: "#ef4444", borderColor: "#fecaca", fontSize: 11 }}
                          onClick={() => {
                            const updated = draftPrompts.filter(x => x.id !== selectedPromptId);
                            saveDraftPromptsToDb(updated);
                            if (updated.length > 0) { setSelectedPromptId(updated[0].id); setDraftPromptEdit({ title: updated[0].title, content: updated[0].content }); }
                            else { setSelectedPromptId("new"); setDraftPromptEdit({ title: "", content: "" }); }
                          }}
                        >삭제</button>
                      )}
                      <button
                        style={{ ...styles.btnSm(true), fontSize: 11 }}
                        onClick={async () => {
                          if (!draftPromptEdit.title.trim()) {
                            alert("프롬프트 제목을 입력해주세요.");
                            return;
                          }
                          if (!draftPromptEdit.content.trim()) {
                            alert("프롬프트 내용을 입력해주세요.");
                            return;
                          }
                          let updated;
                          let savedId;
                          if (selectedPromptId === "new") {
                            savedId = Date.now();
                            updated = [...draftPrompts, { id: savedId, title: draftPromptEdit.title.trim(), content: draftPromptEdit.content.trim() }];
                          } else {
                            savedId = selectedPromptId;
                            updated = draftPrompts.map(x => x.id === selectedPromptId ? { ...x, title: draftPromptEdit.title.trim(), content: draftPromptEdit.content.trim() } : x);
                          }
                          try {
                            await saveDraftPromptsToDb(updated);
                            setSelectedPromptId(savedId);
                            alert("프롬프트가 저장되었습니다.");
                          } catch (e) {
                            alert(`저장 실패: ${e.message}`);
                          }
                        }}
                      >💾 저장</button>
                    </div>

                    {/* 프롬프트 입력 */}
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>프롬프트 제목</div>
                    <input
                      style={{ ...styles.input, marginBottom: 12 }}
                      placeholder="예: 기본 SNS 최적화"
                      value={draftPromptEdit.title}
                      onChange={e => setDraftPromptEdit(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>프롬프트 내용</div>
                    <textarea
                      style={{ ...styles.textarea, minHeight: 90, fontSize: 12, marginBottom: 16 }}
                      placeholder="각 SNS 플랫폼의 특성에 맞게 최적화해주세요..."
                      value={draftPromptEdit.content}
                      onChange={e => setDraftPromptEdit(prev => ({ ...prev, content: e.target.value }))}
                    />

                    {/* 구분선 */}
                    <div style={{ borderTop: "1px solid #f1f5f9", marginBottom: 14 }} />

                    {/* 플랫폼 선택 */}
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 8 }}>생성할 플랫폼 선택</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                      {draftPlatformOrder.map(p => (
                        <button
                          key={p}
                          onClick={() => setDraftGenPlatforms(prev =>
                            prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
                          )}
                          style={{
                            display: "flex", alignItems: "center", gap: 4,
                            padding: "4px 10px", borderRadius: 100, border: "none", cursor: "pointer",
                            fontSize: 11, fontWeight: 600,
                            background: draftGenPlatforms.includes(p) ? PLATFORMS[p].color : "#f1f5f9",
                            color: draftGenPlatforms.includes(p) ? "#fff" : "#94a3b8",
                            transition: "all 0.15s",
                          }}
                        >
                          {PLATFORMS[p].icon} {PLATFORMS[p].name}
                        </button>
                      ))}
                    </div>

                    {/* 초안 생성 버튼 */}
                    <button
                      style={{
                        ...styles.btn(true), width: "100%", justifyContent: "center",
                        background: isDraftGenerating ? "#94a3b8" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        borderColor: "transparent",
                        opacity: isDraftGenerating ? 0.8 : 1,
                        pointerEvents: isDraftGenerating ? "none" : "auto",
                      }}
                      onClick={handleDraftGenerate}
                    >{isDraftGenerating ? "✨ 생성 중..." : "✨ 초안 생성하기"}</button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ─── 하단: SNS 별 글쓰기 및 발행 ─── */}
          <div style={{ ...styles.card, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <div style={styles.cardTitle}>📱 SNS 별 글쓰기 및 발행</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>⠿ 드래그로 순서 변경 · 자동 저장</div>
            </div>
            {/* 발행할 플랫폼 선택 (상단 이동) */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14, padding: "10px 12px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e8eaf0" }}>
              {draftPlatformOrder.map(p => (
                <button
                  key={p}
                  onClick={() => togglePlatform(p)}
                  style={{
                    ...styles.btnSm(content.platforms.includes(p)),
                    background: content.platforms.includes(p) ? PLATFORMS[p].color : "#fff",
                    color: content.platforms.includes(p) ? "#fff" : "#64748b",
                    border: `1px solid ${content.platforms.includes(p) ? PLATFORMS[p].color : "#d1d5db"}`,
                    fontSize: 12,
                  }}
                >
                  {PLATFORMS[p].icon} {PLATFORMS[p].name}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>각 SNS에 맞는 글을 작성하고 발행 여부를 체크하세요.</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {draftPlatformOrder.map(p => (
                <div
                  key={p}
                  draggable
                  onDragStart={() => handleDraftDragStart(p)}
                  onDragOver={handleDraftDragOver}
                  onDrop={() => handleDraftDrop(p)}
                  style={{
                    borderRadius: 10,
                    border: `1px solid ${content.platforms.includes(p) ? PLATFORMS[p].color + "50" : "#e8eaf0"}`,
                    overflow: "hidden",
                    opacity: content.platforms.includes(p) ? 1 : 0.55,
                    transition: "opacity 0.15s, border-color 0.15s",
                  }}
                >
                  <div style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "9px 12px",
                    background: content.platforms.includes(p)
                      ? `linear-gradient(135deg, ${PLATFORMS[p].color}14, ${PLATFORMS[p].color}06)`
                      : "#f8fafc",
                    borderBottom: `1px solid ${PLATFORMS[p].color}15`,
                    cursor: "grab", userSelect: "none",
                  }}>
                    <span style={{ color: "#b0b8c8", fontSize: 14 }}>⠿</span>
                    <span style={{ fontSize: 15 }}>{PLATFORMS[p].icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e" }}>{PLATFORMS[p].name}</span>
                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
                      <input
                        type="checkbox"
                        id={`card-include-${p}`}
                        checked={content.platforms.includes(p)}
                        onChange={() => togglePlatform(p)}
                        style={{ width: 13, height: 13, accentColor: PLATFORMS[p].color, cursor: "pointer" }}
                        onClick={e => e.stopPropagation()}
                      />
                      <label htmlFor={`card-include-${p}`} style={{ fontSize: 11, color: "#64748b", cursor: "pointer" }}>발행</label>
                    </div>
                  </div>
                  <div style={{ padding: "10px 12px", background: "#fff" }}>
                    <textarea
                      style={{ ...styles.textarea, minHeight: 120, fontSize: 12, border: "none", padding: 0, background: "transparent", resize: "vertical" }}
                      placeholder={`${PLATFORMS[p].name}용 글을 입력하세요...`}
                      value={content.platformDrafts[p] || ""}
                      onChange={e => updateDraft(p, e.target.value)}
                    />
                    {/* Instagram 전용: 이미지 URL 입력 */}
                    {p === "instagram" && (
                      <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px dashed #e8eaf0" }}>
                        <div style={{ fontSize: 10, fontWeight: 600, color: "#E1306C", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                          🖼️ 이미지 URL <span style={{ fontWeight: 400, color: "#94a3b8" }}>(필수 — 공개 URL)</span>
                        </div>
                        <input
                          type="text"
                          style={{ ...styles.input, fontSize: 11, padding: "6px 8px", borderColor: "#E1306C30" }}
                          placeholder="https://example.com/image.jpg"
                          value={content.platformDrafts?.instagram_image_url || ""}
                          onChange={e => updateDraft("instagram_image_url", e.target.value)}
                        />
                      </div>
                    )}
                    <div style={{ fontSize: 10, color: "#cbd5e1", textAlign: "right", marginTop: 4 }}>
                      {(content.platformDrafts[p] || "").length}자
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 발행 설정 */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>📤 발행 유형</div>
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              {/* 즉시 발행 카드 */}
              <div
                onClick={() => setPublishMode("now")}
                style={{
                  flex: 1, padding: "14px 16px", borderRadius: 10, cursor: "pointer",
                  border: `2px solid ${publishMode === "now" ? "#6366f1" : "#e2e8f0"}`,
                  background: publishMode === "now" ? "#eef2ff" : "#f8fafc",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 18 }}>📤</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: publishMode === "now" ? "#6366f1" : "#374151" }}>즉시 발행</span>
                  {publishMode === "now" && <span style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: "#6366f1", display: "inline-block" }} />}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>저장과 동시에 SNS에 바로 게시합니다</div>
              </div>
              {/* 예약 발행 카드 */}
              <div
                onClick={() => setPublishMode("schedule")}
                style={{
                  flex: 1, padding: "14px 16px", borderRadius: 10, cursor: "pointer",
                  border: `2px solid ${publishMode === "schedule" ? "#f59e0b" : "#e2e8f0"}`,
                  background: publishMode === "schedule" ? "#fffbeb" : "#f8fafc",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 18 }}>🕐</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: publishMode === "schedule" ? "#d97706" : "#374151" }}>예약 발행</span>
                  {publishMode === "schedule" && <span style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>지정한 날짜·시간에 자동으로 게시합니다</div>
                {publishMode === "schedule" && (
                  <input
                    type="datetime-local"
                    style={{ ...styles.input, marginTop: 10, fontSize: 12 }}
                    value={content.scheduledAt ? content.scheduledAt.replace(" ", "T") : ""}
                    onChange={e => updateContent("scheduledAt", e.target.value.replace("T", " "))}
                    onClick={e => e.stopPropagation()}
                  />
                )}
              </div>
            </div>
            {/* Buffer 연동 상태 표시 */}
            {isBufferAvailable() && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "8px 12px", borderRadius: 8, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                <span style={{ fontSize: 14 }}>📤</span>
                <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>Buffer 연동 활성</span>
                <span style={{ fontSize: 11, color: "#64748b" }}>— 모든 플랫폼이 Buffer를 통해 발행됩니다</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "#94a3b8" }}>{bufferChannels.length}개 채널</span>
              </div>
            )}
            {!isBufferAvailable() && serviceCredentials.buffer?.apiKey?.trim() && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "8px 12px", borderRadius: 8, background: "#fef9c3", border: "1px solid #fde68a" }}>
                <span style={{ fontSize: 14 }}>⚠️</span>
                <span style={{ fontSize: 12, color: "#ca8a04", fontWeight: 600 }}>Buffer API Key 입력됨 — 채널 확인 필요</span>
                <button
                  style={{ marginLeft: "auto", fontSize: 11, padding: "4px 10px", borderRadius: 6, border: "1px solid #ca8a04", background: "#fff", color: "#ca8a04", cursor: "pointer", fontWeight: 600 }}
                  onClick={fetchBufferChannels}
                >채널 확인</button>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
              <button style={styles.btn(false)} onClick={() => setContentsView("list")}>취소</button>
              <button style={styles.btn(false)} onClick={() => handleSaveContent("draft")}>
                <Icons.Download /> 초안 저장
              </button>
              {publishMode === "now" ? (
                <button
                  style={{ ...styles.btn(true), background: "#6366f1", borderColor: "#6366f1" }}
                  onClick={() => handleSaveContent("published")}
                >
                  <Icons.Send /> {isBufferAvailable() ? "Buffer로 발행" : "지금 발행"}
                </button>
              ) : (
                <button
                  style={{ ...styles.btn(true), background: "#f59e0b", borderColor: "#f59e0b" }}
                  onClick={() => handleSaveContent(isBufferAvailable() ? "scheduled_publish" : "scheduled")}
                >
                  <Icons.Clock /> {isBufferAvailable() ? "Buffer 예약 발행" : "예약 등록"}
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    // ── 목록 뷰 (기본) ──────────────────────────────────
    const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();
    const MONTH_NAMES = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
    const DAY_NAMES = ["일","월","화","수","목","금","토"];

    const handleCalPrev = () => {
      if (contentsCalView === "year") { setContentsCalYear(y => y - 1); return; }
      if (contentsCalView === "day") {
        const d = new Date(contentsCalYear, contentsCalMonth, contentsCalSelectedDay - 1);
        setContentsCalYear(d.getFullYear()); setContentsCalMonth(d.getMonth()); setContentsCalSelectedDay(d.getDate()); return;
      }
      if (contentsCalView === "week") {
        const d = new Date(contentsCalYear, contentsCalMonth, contentsCalSelectedDay - 7);
        setContentsCalYear(d.getFullYear()); setContentsCalMonth(d.getMonth()); setContentsCalSelectedDay(d.getDate()); return;
      }
      if (contentsCalMonth === 0) { setContentsCalYear(y => y - 1); setContentsCalMonth(11); }
      else setContentsCalMonth(m => m - 1);
    };
    const handleCalNext = () => {
      if (contentsCalView === "year") { setContentsCalYear(y => y + 1); return; }
      if (contentsCalView === "day") {
        const d = new Date(contentsCalYear, contentsCalMonth, contentsCalSelectedDay + 1);
        setContentsCalYear(d.getFullYear()); setContentsCalMonth(d.getMonth()); setContentsCalSelectedDay(d.getDate()); return;
      }
      if (contentsCalView === "week") {
        const d = new Date(contentsCalYear, contentsCalMonth, contentsCalSelectedDay + 7);
        setContentsCalYear(d.getFullYear()); setContentsCalMonth(d.getMonth()); setContentsCalSelectedDay(d.getDate()); return;
      }
      if (contentsCalMonth === 11) { setContentsCalYear(y => y + 1); setContentsCalMonth(0); }
      else setContentsCalMonth(m => m + 1);
    };
    const handleCalToday = () => { setContentsCalYear(2026); setContentsCalMonth(2); setContentsCalSelectedDay(22); };

    const getPostsForDate = (dateStr) => contentsList.filter(c => {
      const matchDate = c.firstPublishedAt?.startsWith(dateStr) || (!c.firstPublishedAt && c.scheduledAt?.startsWith(dateStr));
      return matchDate && c.platforms.some(p => contentsCalPlatforms.includes(p));
    });
    const buildMonthGrid = () => {
      const firstDay = getFirstDayOfMonth(contentsCalYear, contentsCalMonth);
      const daysCount = getDaysInMonth(contentsCalYear, contentsCalMonth);
      const weeks = [];
      let days = Array(firstDay).fill(null);
      for (let d = 1; d <= daysCount; d++) {
        days.push(d);
        if (days.length === 7) { weeks.push(days); days = []; }
      }
      if (days.length) { while (days.length < 7) days.push(null); weeks.push(days); }
      return weeks;
    };

    // 상태 필터 옵션 (3개)
    const STATUS_FILTER_OPTIONS = [
      { key: "draft", label: "초안" },
      { key: "scheduled", label: "예약" },
      { key: "published", label: "발행완료" },
    ];
    const togglePlatformFilter = (k) => setSearchPlatforms(prev => prev.includes(k) ? prev.filter(p => p !== k) : [...prev, k]);
    const toggleStatusFilter = (k) => setSearchStatuses(prev => prev.includes(k) ? prev.filter(s => s !== k) : [...prev, k]);

    // 필터링 (appliedSearch 기준)
    const { title: af_title, platforms: af_platforms, statuses: af_statuses, regDate: af_regDate, pubDate: af_pubDate, registrant: af_registrant } = appliedSearch;
    const filtered = contentsList.filter(c => {
      if (af_title && !c.title.toLowerCase().includes(af_title.toLowerCase())) return false;
      const allSelected = ALL_PLATFORMS.every(p => af_platforms.includes(p));
      if (!allSelected && !c.platforms.some(p => af_platforms.includes(p))) return false;
      if (af_statuses.length > 0 && !af_statuses.includes(c.status)) return false;
      if (af_registrant && !(c.registrant || "").toLowerCase().includes(af_registrant.toLowerCase())) return false;
      if (af_regDate && !(c.firstPublishedAt || "").startsWith(af_regDate)) return false;
      if (af_pubDate && !(c.updatedAt || "").startsWith(af_pubDate)) return false;
      return true;
    });

    return (
      <div>
        {/* 헤더 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={styles.pageTitle}>콘텐츠 관리</div>
            <div style={styles.pageSubtitle}>콘텐츠를 작성하고, 각 SNS에 맞게 편집하고, 예약·즉시 발행하세요</div>
          </div>
          <button style={{ ...styles.btn(true), padding: "10px 20px", fontSize: 14 }}
            onClick={() => {
              const blank = { id: null, title: "", masterText: "", status: "draft", scheduledAt: null, registrant: "나", registeredAt: new Date().toISOString().slice(0, 10), platforms: ["twitter", "youtube", "facebook", "instagram", "threads"], platformDrafts: { twitter: "", youtube: "", facebook: "", instagram: "", threads: "" } };
              setEditingContent(blank); setContentEditTab("twitter"); setPublishMode("now"); setContentsView("edit");
            }}>
            <Icons.Plus /> 새 콘텐츠
          </button>
        </div>

        {/* 검색 조건 */}
        <div style={{ ...styles.card, marginBottom: 16 }}>
          <div style={{ ...styles.cardTitle, marginBottom: 16 }}>검색 조건</div>
          {/* 1행: 제목 / 최초 발행일 / 수정일 / 등록자 */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>제목</div>
              <input style={styles.input} placeholder="제목 검색..." value={searchTitle} onChange={e => setSearchTitle(e.target.value)} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>최초 발행일</div>
              <input type="date" style={{ ...styles.input, fontSize: 12 }} value={searchRegDate} onChange={e => setSearchRegDate(e.target.value)} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>수정일</div>
              <input type="date" style={{ ...styles.input, fontSize: 12 }} value={searchPubDate} onChange={e => setSearchPubDate(e.target.value)} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>등록자</div>
              <input style={styles.input} placeholder="등록자 검색..." value={searchRegistrant} onChange={e => setSearchRegistrant(e.target.value)} />
            </div>
          </div>
          {/* 2행: 플랫폼 */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 8 }}>플랫폼</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {Object.entries(PLATFORMS).map(([k, v]) => {
                const on = searchPlatforms.includes(k);
                return (
                  <button key={k} onClick={() => togglePlatformFilter(k)}
                    style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: "pointer", border: `1px solid ${on ? v.color : "#d1d5db"}`, background: on ? v.color : "#fff", color: on ? "#fff" : "#374151", transition: "all 0.15s" }}>
                    {v.icon} {v.name}
                  </button>
                );
              })}
            </div>
          </div>
          {/* 3행: 상태 체크박스 */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 8 }}>상태</div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", userSelect: "none" }}>
                <input type="checkbox" checked={searchStatuses.length === 0} onChange={() => setSearchStatuses([])}
                  style={{ width: 14, height: 14, accentColor: "#6366f1", cursor: "pointer" }} />
                <span style={{ fontSize: 12, fontWeight: 500, color: searchStatuses.length === 0 ? "#6366f1" : "#374151" }}>전체</span>
              </label>
              {STATUS_FILTER_OPTIONS.map(o => (
                <label key={o.key} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", userSelect: "none" }}>
                  <input type="checkbox" checked={searchStatuses.includes(o.key)} onChange={() => toggleStatusFilter(o.key)}
                    style={{ width: 14, height: 14, accentColor: STATUS_COLORS[o.key], cursor: "pointer" }} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: searchStatuses.includes(o.key) ? STATUS_COLORS[o.key] : "#374151" }}>{o.label}</span>
                </label>
              ))}
            </div>
          </div>
          {/* 4행: 버튼 */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
            <button style={styles.btn(false)} onClick={() => {
              setSearchTitle(""); setSearchPlatforms(ALL_PLATFORMS); setSearchStatuses([]); setSearchRegDate(""); setSearchPubDate(""); setSearchRegistrant("");
              setAppliedSearch({ title: "", platforms: ALL_PLATFORMS, statuses: [], regDate: "", pubDate: "", registrant: "" });
            }}>
              초기화
            </button>
            <button style={styles.btn(true)} onClick={() => {
              setAppliedSearch({ title: searchTitle, platforms: searchPlatforms, statuses: searchStatuses, regDate: searchRegDate, pubDate: searchPubDate, registrant: searchRegistrant });
            }}>
              <Icons.Search /> 검색
            </button>
          </div>
        </div>

        {/* 콘텐츠 목록 */}
        <div style={{ ...styles.card, marginBottom: 16 }}>
          <div style={{ ...styles.cardTitle, marginBottom: 16 }}>콘텐츠 목록</div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#94a3b8" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
              <div style={{ fontSize: 14 }}>콘텐츠가 없습니다</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>검색 조건을 변경하거나 [+ 새 콘텐츠]로 시작하세요</div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e8eaf0" }}>
                    {["No", "제목", "플랫폼", "등록자", "최초 발행일", "수정일", "상태", "관리"].map(h => (
                      <th key={h} style={{ padding: "10px 12px", textAlign: h === "관리" ? "center" : "left", fontSize: 11, fontWeight: 600, color: "#94a3b8", whiteSpace: "nowrap", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((content, i) => (
                    <tr key={content.id}
                      style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fafbfd"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "12px 12px", color: "#94a3b8", whiteSpace: "nowrap" }}>{i + 1}</td>
                      <td style={{ padding: "12px 12px", maxWidth: 260 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", marginBottom: 2 }}>{content.title || "(제목 없음)"}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {content.masterText ? content.masterText.slice(0, 55) + "..." : "마스터 글 없음"}
                        </div>
                      </td>
                      <td style={{ padding: "12px 12px", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", gap: 2 }}>
                          {content.platforms.map(p => <span key={p} style={{ fontSize: 15 }} title={PLATFORMS[p].name}>{PLATFORMS[p].icon}</span>)}
                        </div>
                      </td>
                      <td style={{ padding: "12px 12px", color: "#64748b", whiteSpace: "nowrap" }}>{content.registrant || "-"}</td>
                      <td style={{ padding: "12px 12px", color: "#64748b", whiteSpace: "nowrap" }}>
                        {content.firstPublishedAt ? content.firstPublishedAt.slice(0, 16) : <span style={{ color: "#cbd5e1" }}>-</span>}
                      </td>
                      <td style={{ padding: "12px 12px", color: "#64748b", whiteSpace: "nowrap" }}>
                        {content.updatedAt ? content.updatedAt.slice(0, 16) : <span style={{ color: "#cbd5e1" }}>-</span>}
                      </td>
                      <td style={{ padding: "12px 12px", whiteSpace: "nowrap" }}>
                        <span style={styles.badge(STATUS_COLORS[content.status])}>{STATUS_LABELS[content.status]}</span>
                      </td>
                      <td style={{ padding: "12px 8px", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                          <button style={{ ...styles.btnSm(false), fontSize: 11, padding: "4px 8px" }}
                            onClick={() => { setEditingContent({ ...content }); setContentEditTab("twitter"); setPublishMode(content.scheduledAt ? "schedule" : "now"); setContentsView("edit"); }}>
                            편집
                          </button>
                          <button style={{ ...styles.btnSm(false), fontSize: 11, padding: "4px 8px", color: "#ef4444", borderColor: "#fecaca" }}
                            onClick={async () => {
                              if (window.confirm(`"${content.title || "(제목 없음)"}"을(를) 삭제하시겠습니까?`)) {
                                const { error } = await supabase.from("contents").delete().eq("id", content.id);
                                if (error) { alert("삭제 오류: " + error.message); return; }
                                setContentsList(prev => prev.filter(c => c.id !== content.id));
                              }
                            }}>
                            삭제
                          </button>
                          <button style={{ ...styles.btnSm(false), fontSize: 11, padding: "4px 8px", background: "#6366f1", color: "#fff", border: "none" }}
                            onClick={async () => {
                              // X 발행
                              if (content.platforms?.includes("twitter") && content.platformDrafts?.twitter?.trim()) {
                                try {
                                  const { data, error } = await supabase.functions.invoke("post-x", {
                                    body: { text: content.platformDrafts.twitter },
                                  });
                                  if (error) throw new Error(error.message);
                                  if (data?.success) {
                                    alert(`✅ X 발행 완료!\n${data.url}`);
                                  } else {
                                    alert(`❌ X 발행 실패: ${data?.error}`);
                                    return;
                                  }
                                } catch (e) {
                                  alert(`❌ X 발행 오류: ${e.message}`);
                                  return;
                                }
                              }
                              const now = new Date().toISOString().replace("T", " ").slice(0, 16);
                              const updateFields = { status: "published" };
                              if (!content.firstPublishedAt) updateFields.first_published_at = now;
                              else updateFields.updated_at = now;
                              const { error } = await supabase.from("contents").update(updateFields).eq("id", content.id);
                              if (error) { alert("발행 상태 저장 오류: " + error.message); return; }
                              const updated = { ...content, status: "published", firstPublishedAt: content.firstPublishedAt || now, updatedAt: content.firstPublishedAt ? now : content.updatedAt };
                              setContentsList(prev => prev.map(c => c.id === content.id ? updated : c));
                            }}>
                            즉시발행
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 캘린더 */}
        <div style={styles.card}>
          <div style={{ ...styles.cardTitle, marginBottom: 0 }}>캘린더</div>

          {/* 구글 캘린더 스타일 헤더 */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0 10px", borderBottom: "1px solid #f1f5f9" }}>
            {/* 왼쪽: 연월 + 네비게이션 */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", minWidth: 130 }}>
                {contentsCalView === "year" ? `${contentsCalYear}년` : `${contentsCalYear}년 ${MONTH_NAMES[contentsCalMonth]}`}
              </span>
              <div style={{ display: "flex", gap: 3 }}>
                <button style={{ ...styles.btnSm(false), padding: "5px 9px", fontSize: 16, lineHeight: 1 }} onClick={handleCalPrev}>‹</button>
                <button style={{ ...styles.btnSm(false), padding: "5px 11px", fontSize: 12 }} onClick={handleCalToday}>오늘</button>
                <button style={{ ...styles.btnSm(false), padding: "5px 9px", fontSize: 16, lineHeight: 1 }} onClick={handleCalNext}>›</button>
              </div>
            </div>
            {/* 오른쪽: 뷰 타입 */}
            <div style={{ display: "flex", gap: 3, background: "#f1f5f9", borderRadius: 8, padding: 3 }}>
              {[{ key: "day", label: "일" }, { key: "week", label: "주" }, { key: "month", label: "월" }, { key: "year", label: "연" }].map(v => (
                <button key={v.key} onClick={() => setContentsCalView(v.key)}
                  style={{ padding: "5px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: contentsCalView === v.key ? "#fff" : "transparent", color: contentsCalView === v.key ? "#6366f1" : "#64748b", boxShadow: contentsCalView === v.key ? "0 1px 3px #0000001a" : "none", transition: "all 0.15s" }}>
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* SNS 필터 — 연월 바로 아래 */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", padding: "10px 0 14px" }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", marginRight: 2 }}>SNS:</span>
            {Object.entries(PLATFORMS).map(([k, v]) => {
              const on = contentsCalPlatforms.includes(k);
              return (
                <button key={k}
                  onClick={() => setContentsCalPlatforms(prev => on ? prev.filter(p => p !== k) : [...prev, k])}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 11px", borderRadius: 100, fontSize: 11, fontWeight: 600, border: `1px solid ${on ? v.color : "#d1d5db"}`, cursor: "pointer", background: on ? v.color : "#fff", color: on ? "#fff" : "#374151", transition: "all 0.15s" }}>
                  {v.icon} {v.name}
                </button>
              );
            })}
          </div>

          {/* 월별 그리드 */}
          {contentsCalView === "month" && (() => {
            const weeks = buildMonthGrid();
            return (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid #f1f5f9", marginBottom: 2 }}>
                  {DAY_NAMES.map((d, i) => (
                    <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 600, padding: "6px 0", color: i === 0 ? "#ef4444" : i === 6 ? "#6366f1" : "#94a3b8" }}>{d}</div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
                  {weeks.flat().map((day, idx) => {
                    const dateStr = day ? `${contentsCalYear}-${String(contentsCalMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : null;
                    const posts = dateStr ? getPostsForDate(dateStr) : [];
                    const isToday = dateStr === "2026-03-22";
                    const isSelected = day === contentsCalSelectedDay;
                    const dow = idx % 7;
                    return (
                      <div key={idx}
                        onClick={() => { if (day) setContentsCalSelectedDay(day); }}
                        style={{ minHeight: 84, padding: "6px 8px", background: isToday ? "#ede9fe" : isSelected ? "#f8f7ff" : "#fafbfd", border: `1.5px solid ${isToday ? "#818cf8" : isSelected ? "#a5b4fc" : "#e8eaf0"}`, borderRadius: 6, opacity: day ? 1 : 0.15, cursor: day ? "pointer" : "default", transition: "border-color 0.1s" }}>
                        {day && <>
                          <div style={{ fontSize: 12, fontWeight: isToday ? 700 : 400, color: isToday ? "#6366f1" : dow === 0 ? "#ef4444" : dow === 6 ? "#818cf8" : "#374151", marginBottom: 3 }}>{day}</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {posts.slice(0, 3).map((post, pi) => {
                              const p = post.platforms.find(pl => contentsCalPlatforms.includes(pl)) || post.platforms[0];
                              return (
                                <div key={pi} title={post.title}
                                  onClick={e => { e.stopPropagation(); setEditingContent({ ...post }); setContentEditTab("twitter"); setPublishMode("schedule"); setContentsView("edit"); }}
                                  style={{ fontSize: 10, padding: "2px 5px", borderRadius: 3, background: PLATFORMS[p]?.color + "20", color: PLATFORMS[p]?.color, borderLeft: `2px solid ${PLATFORMS[p]?.color}`, cursor: "pointer", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>
                                  {PLATFORMS[p]?.icon} {post.title}
                                </div>
                              );
                            })}
                            {posts.length > 3 && <div style={{ fontSize: 10, color: "#94a3b8" }}>+{posts.length - 3}건</div>}
                          </div>
                        </>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* 주별 뷰 */}
          {contentsCalView === "week" && (() => {
            const selDate = new Date(contentsCalYear, contentsCalMonth, contentsCalSelectedDay);
            const dowSel = selDate.getDay();
            return (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
                {Array.from({ length: 7 }, (_, i) => {
                  const d = new Date(contentsCalYear, contentsCalMonth, contentsCalSelectedDay - dowSel + i);
                  const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                  const posts = getPostsForDate(ds);
                  const isToday = ds === "2026-03-22";
                  return (
                    <div key={i} style={{ minHeight: 160, padding: "8px", background: isToday ? "#ede9fe" : "#fafbfd", border: `1px solid ${isToday ? "#818cf8" : "#e8eaf0"}`, borderRadius: 6 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6, color: i === 0 ? "#ef4444" : i === 6 ? "#6366f1" : "#64748b" }}>
                        {DAY_NAMES[i]} {d.getDate()}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {posts.map((post, pi) => {
                          const p = post.platforms.find(pl => contentsCalPlatforms.includes(pl)) || post.platforms[0];
                          return (
                            <div key={pi} onClick={() => { setEditingContent({ ...post }); setContentsView("edit"); }}
                              style={{ fontSize: 10, padding: "3px 6px", borderRadius: 4, background: PLATFORMS[p]?.color + "18", color: PLATFORMS[p]?.color, borderLeft: `3px solid ${PLATFORMS[p]?.color}`, cursor: "pointer", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {PLATFORMS[p]?.icon} {post.title}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* 일별 뷰 */}
          {contentsCalView === "day" && (() => {
            const dateStr = `${contentsCalYear}-${String(contentsCalMonth + 1).padStart(2, "0")}-${String(contentsCalSelectedDay).padStart(2, "0")}`;
            const posts = getPostsForDate(dateStr);
            return (
              <div>
                <div style={{ textAlign: "center", fontSize: 15, fontWeight: 700, color: "#374151", padding: "12px 0 16px" }}>
                  {contentsCalYear}년 {MONTH_NAMES[contentsCalMonth]} {contentsCalSelectedDay}일 ({DAY_NAMES[new Date(contentsCalYear, contentsCalMonth, contentsCalSelectedDay).getDay()]})
                </div>
                {posts.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "32px 0", color: "#cbd5e1" }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
                    예약된 콘텐츠가 없습니다
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {posts.map((post, pi) => (
                      <div key={pi} onClick={() => { setEditingContent({ ...post }); setContentsView("edit"); }}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e8eaf0", cursor: "pointer" }}>
                        <div style={{ display: "flex", gap: 4 }}>{post.platforms.map(p => <span key={p} style={{ fontSize: 18 }}>{PLATFORMS[p]?.icon}</span>)}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{post.title}</div>
                          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{post.scheduledAt}</div>
                        </div>
                        <span style={styles.badge(STATUS_COLORS[post.status])}>{STATUS_LABELS[post.status]}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* 연도별 뷰 */}
          {contentsCalView === "year" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {Array.from({ length: 12 }, (_, m) => {
                const cnt = contentsList.filter(c => c.scheduledAt?.startsWith(`${contentsCalYear}-${String(m + 1).padStart(2, "0")}`)).length;
                return (
                  <div key={m}
                    onClick={() => { setContentsCalMonth(m); setContentsCalView("month"); }}
                    style={{ padding: "16px", borderRadius: 8, background: "#fafbfd", border: "1px solid #e8eaf0", cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#ede9fe"; e.currentTarget.style.borderColor = "#c7d2fe"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#fafbfd"; e.currentTarget.style.borderColor = "#e8eaf0"; }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{MONTH_NAMES[m]}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: cnt > 0 ? "#6366f1" : "#cbd5e1" }}>{cnt}</div>
                    <div style={{ fontSize: 10, color: "#94a3b8" }}>건</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ========================
  //  PAGE: CREATE (기존 — 제거됨, renderContents로 통합)
  // ========================
  const renderCreate = () => (
    <div>
      <div style={styles.pageTitle}>콘텐츠 제작</div>
      <div style={styles.pageSubtitle}>원소스 멀티유즈 — 하나의 원본으로 모든 채널용 콘텐츠를 자동 생성합니다</div>

      <div style={{ ...styles.card, marginBottom: 20 }}>
        <div style={styles.cardTitle}>✍️ 원본 콘텐츠 입력</div>
        <textarea
          style={styles.textarea}
          placeholder="원본 글을 입력하세요. 블로그 포스트, 보도자료, 제품 설명 등 어떤 형태든 괜찮습니다. AI가 각 플랫폼에 최적화된 형태로 변환합니다."
          value={multiUseInput}
          onChange={(e) => setMultiUseInput(e.target.value)}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {Object.entries(PLATFORMS).map(([key, p]) => (
              <button
                key={key}
                onClick={() => setSelectedPlatforms(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])}
                style={{
                  ...styles.btnSm(selectedPlatforms.includes(key)),
                  background: selectedPlatforms.includes(key) ? p.color : "#f1f5f9",
                  color: selectedPlatforms.includes(key) ? "#fff" : "#64748b",
                  border: "none",
                }}
              >
                {p.icon} {p.name}
              </button>
            ))}
          </div>
          <button style={styles.btn(true)} onClick={handleGenerate}>
            <Icons.Zap /> AI 변환하기
          </button>
        </div>
      </div>

      {/* Tone Presets */}
      <div style={{ ...styles.card, marginBottom: 20 }}>
        <div style={styles.cardTitle}>🎨 톤앤매너 프리셋</div>
        <div style={{ display: "flex", gap: 8 }}>
          {["공식적 · 전문적", "친근한 · 유머러스", "감성적 · 스토리텔링", "간결한 · 팩트 중심", "+ 커스텀 추가"].map((tone, i) => (
            <button key={i} style={{ ...styles.btnSm(i === 1), borderRadius: 100 }}>{tone}</button>
          ))}
        </div>
      </div>

      {/* Loading Animation */}
      {isGenerating && (
        <div style={{ ...styles.card, textAlign: "center", padding: "48px 24px" }}>
          <div style={{ display: "inline-flex", gap: 8, marginBottom: 16 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 12, height: 12, borderRadius: "50%",
                background: "#6366f1",
                animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
          <div style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>AI가 5개 플랫폼에 맞게 콘텐츠를 변환하고 있습니다...</div>
          <style>{`@keyframes pulse { 0%,100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }`}</style>
        </div>
      )}

      {/* Generated Content */}
      {generatedContent && !isGenerating && (
        <div>
          {/* Summary Header */}
          <div style={{
            ...styles.card,
            background: "linear-gradient(135deg, #ede9fe, #e0e7ff)",
            border: "1px solid #c7d2fe",
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#3730a3", marginBottom: 4 }}>✅ 5개 플랫폼 콘텐츠 생성 완료</div>
              <div style={{ fontSize: 12, color: "#6366f1" }}>원본 글을 각 플랫폼의 특성에 맞게 톤, 길이, 포맷, 해시태그를 최적화했습니다</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={styles.btn(false)}><Icons.Copy /> 전체 복사</button>
              <button style={styles.btn(true)}><Icons.Send /> 발행 화면으로</button>
            </div>
          </div>

          {/* Platform Cards - Full Width Stack */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {Object.entries(generatedContent).filter(([key]) => selectedPlatforms.includes(key)).map(([key, data]) => (
              <div key={key} style={{
                ...styles.card,
                padding: 0,
                overflow: "hidden",
                border: `1px solid ${PLATFORMS[key].color}25`,
              }}>
                {/* Platform Header */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 20px",
                  background: `linear-gradient(135deg, ${PLATFORMS[key].color}10, ${PLATFORMS[key].color}05)`,
                  borderBottom: `1px solid ${PLATFORMS[key].color}15`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: PLATFORMS[key].color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 16, color: "#fff",
                    }}>{PLATFORMS[key].icon}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>{PLATFORMS[key].name}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{data.format}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={styles.btnSm(false)}><Icons.Copy /> 복사</button>
                    <button style={styles.btnSm(false)}><Icons.Edit /> 수정</button>
                    <button style={{
                      ...styles.btnSm(false),
                      background: PLATFORMS[key].color,
                      color: "#fff",
                      border: "none",
                    }}><Icons.Send /> 예약 발행</button>
                  </div>
                </div>

                <div style={{ display: "flex" }}>
                  {/* Content Body */}
                  <div style={{ flex: 1, padding: "18px 20px" }}>
                    <pre style={{
                      fontSize: 13, color: "#374151",
                      whiteSpace: "pre-wrap", lineHeight: 1.8,
                      margin: 0, fontFamily: "inherit",
                      maxHeight: 320, overflowY: "auto",
                    }}>{data.text}</pre>
                  </div>

                  {/* Meta Sidebar */}
                  <div style={{
                    width: 200, flexShrink: 0,
                    padding: "18px 16px",
                    background: "#f8fafc",
                    borderLeft: "1px solid #e8eaf0",
                    display: "flex", flexDirection: "column", gap: 12,
                  }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", marginBottom: 4 }}>글자 수</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e" }}>{data.charCount}<span style={{ fontSize: 11, fontWeight: 400, color: "#94a3b8" }}>자</span></div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", marginBottom: 4 }}>해시태그</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e" }}>{data.hashtags}<span style={{ fontSize: 11, fontWeight: 400, color: "#94a3b8" }}>개</span></div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", marginBottom: 4 }}>권장 포맷</div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "#374151" }}>{data.format}</div>
                    </div>
                    <div style={{
                      marginTop: "auto",
                      padding: "10px 12px",
                      borderRadius: 8,
                      background: "#fef3c7",
                      border: "1px solid #fde68a",
                    }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: "#92400e", marginBottom: 3 }}>💡 TIP</div>
                      <div style={{ fontSize: 11, color: "#78350f", lineHeight: 1.5 }}>{data.tip}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );


  // ========================
  //  PAGE: COMMUNITY
  // ========================
  const renderCommunity = () => {
    const filtered = commentFilter === "all" ? MOCK_COMMENTS : MOCK_COMMENTS.filter(c => c.sentiment === commentFilter);
    return (
      <div>
        <div style={styles.pageTitle}>커뮤니티 관리</div>
        <div style={styles.pageSubtitle}>모든 채널의 댓글과 DM을 한 곳에서 관리하세요</div>

        {/* Sentiment Overview */}
        <div style={{ ...styles.grid3, marginBottom: 20 }}>
          {[
            { label: "긍정 댓글", count: 24, pct: "58%", color: "#10b981" },
            { label: "부정 댓글", count: 5, pct: "12%", color: "#ef4444" },
            { label: "미답변", count: 8, pct: "", color: "#f59e0b" },
          ].map((s, i) => (
            <div key={i} style={{ ...styles.card, borderLeft: `4px solid ${s.color}`, padding: "16px 18px" }}>
              <div style={{ fontSize: 12, color: "#64748b" }}>{s.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>{s.count} <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 400 }}>{s.pct}</span></div>
            </div>
          ))}
        </div>

        {/* Filter & Comments */}
        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={styles.cardTitle}>💬 통합 인박스</div>
            <div style={{ display: "flex", gap: 4 }}>
              {[{ key: "all", label: "전체" }, { key: "negative", label: "부정" }, { key: "positive", label: "긍정" }, { key: "neutral", label: "중립" }].map(f => (
                <button key={f.key} style={styles.tab(commentFilter === f.key)} onClick={() => setCommentFilter(f.key)}>{f.label}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "14px 16px", borderRadius: 10, background: c.sentiment === "negative" ? "#fef2f2" : "#f8fafc", border: "1px solid #e8eaf0" }}>
                <div style={{ ...styles.platformDot(PLATFORMS[c.platform].color), marginTop: 4 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{c.user}</span>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>{PLATFORMS[c.platform].name}</span>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>{c.time}</span>
                    <span style={{ ...styles.badge(sentimentColors[c.sentiment]), marginLeft: "auto" }}>{sentimentLabels[c.sentiment]}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#374151", marginBottom: 10, lineHeight: 1.5 }}>{c.text}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={styles.btnSm(true)}><Icons.Zap /> AI 답글 생성</button>
                    <button style={styles.btnSm(false)}>직접 답글</button>
                    {c.replied && <span style={{ ...styles.badge("#10b981"), marginLeft: 4 }}>답변완료</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ========================
  //  PAGE: ANALYTICS
  // ========================
  const renderAnalytics = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={styles.pageTitle}>성과 분석</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={styles.btn(false)} onClick={() => setAiInsight(true)}><Icons.Zap /> AI 인사이트</button>
          <button style={styles.btn(true)}><Icons.Download /> 보고서 생성</button>
        </div>
      </div>
      <div style={styles.pageSubtitle}>크로스 채널 성과를 분석하고 인사이트를 도출합니다</div>

      {/* Tabs */}
      <div style={styles.tabBar}>
        {[{ key: "overview", label: "전체 개요" }, { key: "channel", label: "채널별 상세" }, { key: "content", label: "콘텐츠별 성과" }].map(t => (
          <button key={t.key} style={styles.tab(analysisView === t.key)} onClick={() => setAnalysisView(t.key)}>{t.label}</button>
        ))}
      </div>

      {/* AI Insight */}
      {aiInsight && (
        <div style={{ ...styles.card, background: "linear-gradient(135deg, #ede9fe, #fae8ff)", border: "1px solid #c4b5fd", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={styles.cardTitle}>🤖 AI 인사이트 리포트</div>
            <button onClick={() => setAiInsight(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#94a3b8" }}>✕</button>
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: "#374151" }}>
            <p style={{ margin: "0 0 10px" }}>📈 <strong>이번 주 핵심 분석:</strong> 전체 인게이지먼트율이 전주 대비 12.1% 상승했습니다.</p>
            <p style={{ margin: "0 0 10px" }}>🏆 <strong>최고 성과:</strong> 화요일 인스타그램 밈 콘텐츠가 도달 15,200을 기록하며 이번 주 최고 성과를 보였습니다. 유머러스한 톤의 콘텐츠가 평균 대비 2.1배 높은 공유율을 기록하고 있습니다.</p>
            <p style={{ margin: "0 0 10px" }}>💡 <strong>포맷 분석:</strong> 캐러셀 포맷이 단일 이미지 대비 1.8배, 릴스가 2.3배 높은 저장률을 보여줍니다.</p>
            <p style={{ margin: 0 }}>📋 <strong>추천 액션:</strong> ① 유머/밈 콘텐츠를 주 2회로 확대 ② 캐러셀 형식을 교육 콘텐츠에 적극 활용 ③ X(Twitter)의 인게이지먼트가 낮으므로 스레드 형식의 심층 콘텐츠 테스트 권장</p>
          </div>
        </div>
      )}

      {/* Channel Charts */}
      <div style={styles.grid2}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>📊 채널별 도달 추이 (최근 7일)</div>
          {Object.entries(PLATFORMS).map(([key, p]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 12, width: 70, color: "#64748b" }}>{p.icon} {p.name.split(" ")[0]}</span>
              <div style={{ flex: 1, height: 24, background: "#f1f5f9", borderRadius: 6, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${Math.random() * 60 + 30}%`,
                  background: `linear-gradient(90deg, ${p.color}cc, ${p.color})`,
                  borderRadius: 6,
                  transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
                }} />
              </div>
            </div>
          ))}
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>📈 인게이지먼트율 비교</div>
          <MiniBarChart data={[4.7, 3.2, 5.1, 2.8, 4.0]} color="#8b5cf6" height={140} />
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0 4px", fontSize: 11, color: "#94a3b8" }}>
            {Object.values(PLATFORMS).map(p => <span key={p.name}>{p.icon}</span>)}
          </div>
        </div>
      </div>

      {/* Post Rankings */}
      <div style={{ ...styles.card, marginTop: 16 }}>
        <div style={styles.cardTitle}>🏆 콘텐츠 성과 랭킹</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e8eaf0" }}>
              {["순위", "콘텐츠", "채널", "도달", "인게이지먼트", "비율", "포맷"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 8px", fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_POSTS_RANKING.map((post, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px 8px", fontWeight: 700, color: i < 3 ? "#6366f1" : "#94a3b8" }}>{i + 1}</td>
                <td style={{ padding: "12px 8px", fontWeight: 500 }}>{post.title}</td>
                <td style={{ padding: "12px 8px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={styles.platformDot(PLATFORMS[post.platform].color)} />
                    {PLATFORMS[post.platform].name}
                  </span>
                </td>
                <td style={{ padding: "12px 8px" }}>{post.reach.toLocaleString()}</td>
                <td style={{ padding: "12px 8px" }}>{post.engage.toLocaleString()}</td>
                <td style={{ padding: "12px 8px", fontWeight: 600, color: "#10b981" }}>{post.rate}</td>
                <td style={{ padding: "12px 8px" }}><span style={styles.tag}>{post.format}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ========================
  //  PAGE: OPTIMIZE
  // ========================
  const renderOptimize = () => (
    <div>
      <div style={styles.pageTitle}>전략 최적화</div>
      <div style={styles.pageSubtitle}>데이터 기반으로 다음 전략을 수립하고 성과를 극대화하세요</div>

      <div style={styles.tabBar}>
        {[{ key: "pattern", label: "성과 패턴 분석" }, { key: "recommend", label: "AI 콘텐츠 추천" }, { key: "position", label: "경쟁사 포지셔닝" }].map(t => (
          <button key={t.key} style={styles.tab(optimizationTab === t.key)} onClick={() => setOptimizationTab(t.key)}>{t.label}</button>
        ))}
      </div>

      {optimizationTab === "pattern" && (
        <div>
          <div style={{ ...styles.card, marginBottom: 16 }}>
            <div style={styles.cardTitle}>🎯 최고 성과 조합 TOP 3</div>
            <div style={styles.grid3}>
              {[
                { rank: "🥇", day: "화요일", time: "19:00", format: "캐러셀", topic: "교육형", avgRate: "7.8%" },
                { rank: "🥈", day: "목요일", time: "20:00", format: "릴스", topic: "비하인드", avgRate: "7.2%" },
                { rank: "🥉", day: "토요일", time: "11:00", format: "밈/유머", topic: "트렌드", avgRate: "6.9%" },
              ].map((combo, i) => (
                <div key={i} style={{ ...styles.card, background: i === 0 ? "linear-gradient(135deg, #fef3c7, #fef9c3)" : "#fafbfd", border: i === 0 ? "1px solid #fbbf2433" : "1px solid #e8eaf0" }}>
                  <div style={{ fontSize: 20, marginBottom: 8 }}>{combo.rank}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                      <span style={{ color: "#64748b" }}>요일</span><span style={{ fontWeight: 600 }}>{combo.day} {combo.time}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                      <span style={{ color: "#64748b" }}>포맷</span><span style={{ fontWeight: 600 }}>{combo.format}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                      <span style={{ color: "#64748b" }}>주제</span><span style={{ fontWeight: 600 }}>{combo.topic}</span>
                    </div>
                    <div style={{ marginTop: 4, padding: "6px 10px", borderRadius: 6, background: "#10b98118", textAlign: "center", fontSize: 14, fontWeight: 700, color: "#10b981" }}>
                      평균 {combo.avgRate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>📊 요일·시간대별 인게이지먼트 히트맵</div>
            <div style={{ overflowX: "auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "60px repeat(7, 1fr)", gap: 3, minWidth: 500 }}>
                <div />
                {["월", "화", "수", "목", "금", "토", "일"].map(d => (
                  <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: "#94a3b8", padding: 6 }}>{d}</div>
                ))}
                {["09시", "12시", "15시", "18시", "21시"].map((time, ti) => (
                  <>
                    <div key={`t-${ti}`} style={{ fontSize: 11, color: "#94a3b8", padding: 6, display: "flex", alignItems: "center" }}>{time}</div>
                    {[0.2, 0.8, 0.4, 0.9, 0.3, 0.7, 0.5, 0.1, 0.6, 0.3, 0.7, 0.2, 0.5, 0.4, 0.3, 0.5, 0.6, 0.8, 0.4, 0.6, 0.3, 0.4, 0.7, 0.5, 0.9, 0.3, 0.8, 0.2, 0.5, 0.9, 0.7, 0.6, 0.4, 0.3, 0.8].slice(ti * 7, ti * 7 + 7).map((v, di) => (
                      <div key={`${ti}-${di}`} style={{
                        height: 36,
                        borderRadius: 6,
                        background: `rgba(99, 102, 241, ${v * 0.8 + 0.1})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        color: v > 0.5 ? "#fff" : "#6366f1",
                        fontWeight: 600,
                      }}>
                        {(v * 10).toFixed(1)}%
                      </div>
                    ))}
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {optimizationTab === "recommend" && (
        <div style={styles.card}>
          <div style={styles.cardTitle}>💡 AI 콘텐츠 추천 — 다음 주</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { day: "월요일", topic: "주간 트렌드 큐레이션", format: "캐러셀", platform: "instagram", reason: "월요일 교육형 콘텐츠 성과 우수" },
              { day: "화요일", topic: "제품 활용 팁 릴스", format: "릴스/숏츠", platform: "instagram", reason: "화요일 저녁 릴스 인게이지먼트 최고" },
              { day: "수요일", topic: "고객 후기 리그램", format: "UGC", platform: "facebook", reason: "UGC 콘텐츠 신뢰도 상승 효과" },
              { day: "목요일", topic: "업계 인사이트 스레드", format: "스레드", platform: "twitter", reason: "X 인게이지먼트 개선을 위한 장문 콘텐츠 테스트" },
              { day: "금요일", topic: "주말 이벤트 티저", format: "이미지", platform: "threads", reason: "금요일 프로모션 콘텐츠 도달률 높음" },
            ].map((rec, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 10, background: "#f8fafc", border: "1px solid #e8eaf0" }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{rec.day.slice(0, 1)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{rec.topic}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    <span style={styles.tag}>{rec.format}</span>
                    <span style={styles.tag}>{PLATFORMS[rec.platform]?.icon} {PLATFORMS[rec.platform]?.name}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>📊 {rec.reason}</div>
                </div>
                <button style={styles.btnSm(true)}>캘린더에 추가</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {optimizationTab === "position" && (
        <div style={styles.card}>
          <div style={styles.cardTitle}>🎯 경쟁사 대비 포지셔닝</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div style={{ padding: 16, borderRadius: 10, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#16a34a", marginBottom: 8 }}>💪 강점</div>
              <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.8 }}>
                • 캐러셀 콘텐츠 인게이지먼트율 업계 평균 대비 1.5배<br />
                • 교육형 콘텐츠에서 독보적 전문성 인정<br />
                • 댓글 응답률 92%로 커뮤니티 관리 우수
              </div>
            </div>
            <div style={{ padding: 16, borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#dc2626", marginBottom: 8 }}>⚠️ 약점</div>
              <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.8 }}>
                • 영상 콘텐츠(릴스/숏츠) 비중이 경쟁사 대비 낮음<br />
                • X(Twitter) 채널 인게이지먼트 업계 평균 이하<br />
                • 게시 빈도가 경쟁사 B 대비 40% 낮음
              </div>
            </div>
            <div style={{ padding: 16, borderRadius: 10, background: "#ede9fe", border: "1px solid #c4b5fd" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#7c3aed", marginBottom: 8 }}>🚀 기회</div>
              <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.8 }}>
                • Threads 채널 초기 진입 — 경쟁사 부재<br />
                • 밈/유머 콘텐츠 테스트 결과 높은 공유율 확인<br />
                • 유튜브 숏츠 알고리즘 강화 시기 활용
              </div>
            </div>
            <div style={{ padding: 16, borderRadius: 10, background: "#fef9c3", border: "1px solid #fde68a" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#ca8a04", marginBottom: 8 }}>🔒 위협</div>
              <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.8 }}>
                • 경쟁사 C의 높은 인게이지먼트율(6.2%) 추격<br />
                • 인스타그램 알고리즘 변경으로 도달 감소 추세<br />
                • 업계 전반 광고 단가 상승
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ========================
  //  PAGE: 연동 관리
  // ========================
  const renderSnsIntegration = () => {
    // 서비스 연동 필드 정의
    const serviceFields = {
      supabase: {
        label: "Supabase", icon: "⚡", color: "#3ecf8e", url: "https://supabase.com",
        note: "supabase.com → Project Settings → API",
        desc: "PostgreSQL 기반의 오픈소스 백엔드 서비스. 데이터베이스, 인증, 스토리지, 실시간 기능을 제공하며 SNS 대시보드의 모든 데이터를 저장하고 관리하는 핵심 인프라입니다.",
        fields: [
          { key: "projectUrl",     label: "Project URL",       placeholder: "https://xxxx.supabase.co",  secret: false },
          { key: "publishableKey", label: "Publishable Key",   placeholder: "eyJhbGciOiJIUzI1NiIs...", secret: true },
          { key: "anonKeyLegacy",  label: "Anon Key (Legacy)", placeholder: "eyJhbGciOiJIUzI1NiIs...", secret: true },
        ],
      },
      github: {
        label: "GitHub", icon: "🐙", color: "#24292e", url: "https://github.com",
        note: "github.com → Settings → Developer settings → Personal access tokens",
        desc: "전 세계 개발자가 사용하는 코드 저장소 플랫폼. SNS 대시보드의 소스코드를 버전 관리하고, 변경 이력을 추적하거나 Vercel 자동 배포의 트리거로 활용됩니다.",
        fields: [
          { key: "personalAccessToken", label: "Personal Access Token", placeholder: "ghp_xxxxxxxxxxxx", secret: true },
          { key: "owner",               label: "Owner (유저명/조직명)",    placeholder: "myusername", secret: false },
          { key: "repo",                label: "Repository",              placeholder: "my-repo", secret: false },
        ],
      },
      vercel: {
        label: "Vercel", icon: "▲", color: "#000000", url: "https://vercel.com",
        note: "vercel.com → Account Settings → Tokens",
        desc: "프론트엔드 특화 클라우드 배포 플랫폼. GitHub와 연동하면 코드를 푸시할 때마다 SNS 대시보드를 자동으로 빌드하고 전 세계 CDN에 즉시 배포해줍니다.",
        fields: [
          { key: "accessToken", label: "Access Token", placeholder: "xxxxxxxxxxxxxxxxxxxxxxxx", secret: true },
          { key: "projectId",   label: "Project ID",   placeholder: "prj_xxxxxxxxxxxx", secret: false },
          { key: "orgId",       label: "Org ID (팀)",  placeholder: "team_xxxxxxxxxxxx", secret: false },
        ],
      },
      googleSheet: {
        label: "Google Spreadsheet", icon: "📊", color: "#34a853", url: "https://sheets.google.com",
        note: "Google Cloud Console → 서비스 계정 → 키 생성 (JSON)",
        desc: "구글이 제공하는 클라우드 기반 스프레드시트. SNS 콘텐츠 발행 일정, 성과 데이터를 시트에서 직접 관리하거나 대시보드와 양방향 데이터 동기화에 활용됩니다.",
        fields: [
          { key: "spreadsheetId",      label: "Spreadsheet ID",         placeholder: "1IjmqpRxS_00CLrN...", secret: false },
          { key: "serviceAccountEmail", label: "Service Account Email",  placeholder: "xxx@project.iam.gserviceaccount.com", secret: false },
          { key: "privateKey",         label: "Private Key",            placeholder: "-----BEGIN RSA PRIVATE KEY-----", secret: true },
        ],
      },
      openai: {
        label: "OpenAI", icon: "🤖", color: "#10a37f", url: "https://platform.openai.com",
        note: "platform.openai.com → API keys → Create new secret key",
        desc: "OpenAI의 GPT 모델을 활용해 마스터 글을 각 SNS 플랫폼에 맞는 초안으로 자동 변환합니다. API 키를 저장하면 [초안 생성하기] 버튼이 실제 AI로 동작합니다.",
        fields: [
          { key: "apiKey", label: "API Key", placeholder: "sk-proj-xxxxxxxxxxxxxxxxxxxx", secret: true },
        ],
      },
      buffer: {
        label: "Buffer", icon: "📤", color: "#231F20", url: "https://publish.buffer.com/settings/api",
        note: "publish.buffer.com → Settings → API 에서 API Key 발급",
        desc: "Buffer를 통해 X, Instagram, Facebook, Threads, LinkedIn, TikTok 등 모든 SNS에 API Key 하나로 발행합니다. 각 SNS 인증은 Buffer 웹사이트에서 한 번만 연결하면 됩니다. 연결 후 '채널 확인' 버튼으로 매핑된 채널을 확인하세요.",
        fields: [
          { key: "apiKey", label: "API Key", placeholder: "c_xxxxxxxxxxxxxxxxxx...", secret: true },
        ],
      },
    };

    const handleServiceCredentialChange = (service, fieldKey, value) => {
      setServiceCredentials(prev => ({
        ...prev,
        [service]: { ...prev[service], [fieldKey]: value },
      }));
      if (serviceSaveStatus[service] === "saved") {
        setServiceSaveStatus(prev => ({ ...prev, [service]: null }));
      }
    };

    const handleServiceSave = async (service) => {
      setServiceSaveStatus(prev => ({ ...prev, [service]: "saving" }));
      const { error } = await supabase.from("service_credentials").upsert({
        service,
        credentials: serviceCredentials[service],
        is_connected: Object.values(serviceCredentials[service]).some(v => v.trim() !== ""),
        updated_at: new Date().toISOString(),
      }, { onConflict: "service" });
      setServiceSaveStatus(prev => ({ ...prev, [service]: error ? null : "saved" }));
      if (error) alert(`저장 실패: ${error.message}`);
    };

    const isServiceConnected = (service) =>
      Object.values(serviceCredentials[service]).some(v => v.trim() !== "");

    // SNS 플랫폼별 입력 필드 정의 (노출 순서: X → YouTube → Facebook → Instagram → Threads)
    const platformFields = [
      { id: "twitter",
        label: "X (Twitter)", icon: "𝕏", color: "#14171A", url: "https://developer.twitter.com",
        note: "developer.twitter.com → Project & App → Keys and Tokens",
        fields: [
          { key: "bearerToken",      label: "Bearer Token",        group: "앱 전용 인증",  placeholder: "AAAAAAAAAAAAAAAAAAAAAxxxxx...", secret: true },
          { key: "consumerKey",      label: "소비자 키",            group: "OAuth 1.0 키", placeholder: "xxxxxxxxxxxxxxxxxxxx",          secret: true,  pair: "start", pairBg: "#eff6ff", pairBorder: "#bfdbfe" },
          { key: "consumerKeySecret",label: "Consumer Key Secret",  group: "OAuth 1.0 키", placeholder: "xxxxxxxxxxxxxxxxxxxx",          secret: true,  pair: "end" },
          { key: "accessToken",      label: "액세스 토큰",          group: "OAuth 1.0 키", placeholder: "000000000-xxxxxxxxxx",          secret: true,  pair: "start", pairBg: "#f3f4f6", pairBorder: "#d1d5db" },
          { key: "accessTokenSecret",label: "액세스 토큰 시크릿",   group: "OAuth 1.0 키", placeholder: "xxxxxxxxxxxxxxxxxxxx",          secret: true,  pair: "end" },
          { key: "clientId",         label: "클라이언트 ID",        group: "OAuth 2.0 키", placeholder: "MklKRnJkM1E1dDlEWTJ4...",      secret: true },
          { key: "clientSecret",     label: "클라이언트 시크릿",    group: "OAuth 2.0 키", placeholder: "xxxxxxxxxxxxxxxxxxxx",          secret: true },
        ],
      },
      { id: "youtube",
        label: "YouTube", icon: "▶️", color: "#FF0000", url: "https://console.cloud.google.com",
        note: "Google Cloud Console → OAuth 2.0 클라이언트 ID 생성 (youtube_auth.py로 토큰 발급)",
        fields: [
          { key: "clientId",     label: "Client ID",     placeholder: "xxxxxx.apps.googleusercontent.com", secret: false },
          { key: "clientSecret", label: "Client Secret", placeholder: "GOCSPX-xxxxxxxxxx", secret: true },
        ],
      },
      { id: "facebook",
        label: "Facebook", icon: "👤", color: "#1877F2", url: "https://developers.facebook.com",
        note: "Meta 개발자 콘솔 → 내 앱 → 앱 설정 → 기본 설정",
        fields: [
          { key: "appId",       label: "앱 ID",          placeholder: "123456789012345", secret: true },
          { key: "appSecret",   label: "앱 시크릿 코드",  placeholder: "xxxxxxxxxxxxxxxx", secret: true },
          { key: "accessToken", label: "액세스 토큰",     placeholder: "EAAxxxxxx...",    secret: true },
          { key: "pageId",      label: "페이지 ID",       placeholder: "123456789012345", secret: true },
        ],
      },
      { id: "instagram",
        label: "Instagram", icon: "📸", color: "#E1306C", url: "https://developers.facebook.com/docs/instagram-api",
        note: "Meta 개발자 콘솔 → Instagram Graph API → 콘텐츠 발행용 (Facebook Page 연결 필요)",
        fields: [
          { key: "accessToken",    label: "Access Token",      placeholder: "EAAxxxxxx...",       secret: true },
          { key: "userId",         label: "Instagram User ID", placeholder: "17841400000000000", secret: false },
          { key: "facebookPageId", label: "Facebook Page ID",   placeholder: "123456789012345",   secret: false },
        ],
      },
      { id: "threads",
        label: "Threads", icon: "🔗", color: "#000000", url: "https://developers.facebook.com/docs/threads",
        note: "Meta 개발자 콘솔 → Threads API 앱 → 액세스 토큰 생성",
        fields: [
          { key: "appId",       label: "App ID",       placeholder: "1323468196478327", secret: false },
          { key: "accessToken", label: "Access Token", placeholder: "EAAxxxxxx...",     secret: true },
        ],
      },
    ];

    // 드래그 앤 드롭 핸들러
    const handleDragStart = (id) => { dragSnsRef.current = id; };
    const handleDragOver  = (e)  => { e.preventDefault(); };
    const handleDrop      = (targetId) => {
      const draggedId = dragSnsRef.current;
      if (!draggedId || draggedId === targetId) return;
      setSnsOrder(prev => {
        const next = [...prev];
        const from = next.indexOf(draggedId);
        const to   = next.indexOf(targetId);
        next.splice(from, 1);
        next.splice(to, 0, draggedId);
        localStorage.setItem("snsOrder", JSON.stringify(next)); // 자동 저장
        return next;
      });
      dragSnsRef.current = null;
    };

    const handleCredentialChange = (platform, fieldKey, value) => {
      setSnsCredentials(prev => ({
        ...prev,
        [platform]: { ...prev[platform], [fieldKey]: value },
      }));
      // 저장 상태 초기화
      if (snsSaveStatus[platform] === "saved") {
        setSnsSaveStatus(prev => ({ ...prev, [platform]: null }));
      }
    };

    const handleSave = async (platform) => {
      setSnsSaveStatus(prev => ({ ...prev, [platform]: "saving" }));
      const { error } = await supabase.from("sns_credentials").upsert({
        platform,
        credentials: snsCredentials[platform],
        is_connected: Object.values(snsCredentials[platform]).some(v => v.trim() !== ""),
        updated_at: new Date().toISOString(),
      }, { onConflict: "platform" });
      setSnsSaveStatus(prev => ({ ...prev, [platform]: error ? null : "saved" }));
      if (error) alert(`저장 실패: ${error.message}`);
    };

    const toggleTokenVisibility = (key) => {
      setShowTokens(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const isConnected = (platform) => {
      const creds = snsCredentials[platform];
      return Object.values(creds).some(v => v.trim() !== "");
    };

    // 공통 자격증명 카드 렌더러
    const renderCredentialCard = ({ key, platform, connected, saveStatus, credentials, onFieldChange, onSave, tokenPrefix, draggable, onDragStart, onDragOver, onDrop }) => (
      <div
        key={key}
        draggable={!!draggable}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        style={{
          ...styles.card,
          border: connected ? `1px solid ${platform.color}40` : "1px solid #e8eaf0",
          cursor: draggable ? "grab" : "default",
          transition: "box-shadow 0.15s",
        }}
      >
        {/* 헤더 */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
          {draggable && (
            <div style={{ marginRight: 10, color: "#cbd5e1", fontSize: 16, cursor: "grab", userSelect: "none" }}>⠿</div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: platform.color,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, color: "#fff", flexShrink: 0,
            }}>{platform.icon}</div>
            <div>
              <a
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
                onMouseEnter={e => e.currentTarget.style.color = platform.color}
                onMouseLeave={e => e.currentTarget.style.color = "#1a1a2e"}
              >
                {platform.label} <Icons.ExternalLink />
              </a>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{platform.note}</div>
            </div>
          </div>
          {connected && (
            <div style={{ marginLeft: "auto", fontSize: 11, fontWeight: 600, color: "#10b981", background: "#d1fae5", padding: "3px 10px", borderRadius: 100 }}>
              연결됨
            </div>
          )}
        </div>

        {/* 서비스 설명 */}
        {platform.desc && (
          <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7, marginBottom: 16 }}>
            {platform.desc}
          </div>
        )}

        {/* 입력 필드들 */}
        <div style={{ marginBottom: 16 }}>
          {(() => {
            // group이 있는 경우(X) group 헤더를 표시, 없는 경우 기존 2열 그리드
            const hasGroup = platform.fields.some(f => f.group);
            if (!hasGroup) {
              return (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {platform.fields.map(field => {
                    const tokenKey = `${tokenPrefix}-${field.key}`;
                    const isVisible = showTokens[tokenKey];
                    return (
                      <div key={field.key}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 6 }}>{field.label}</div>
                        <div style={{ position: "relative" }}>
                          <input
                            type={field.secret && !isVisible ? "password" : "text"}
                            style={{ ...styles.input, paddingRight: field.secret ? 38 : 14, fontFamily: field.secret && !isVisible ? "monospace" : "inherit" }}
                            placeholder={field.placeholder}
                            value={credentials[field.key] ?? ""}
                            onChange={(e) => onFieldChange(field.key, e.target.value)}
                          />
                          {field.secret && (
                            <button onClick={() => toggleTokenVisibility(tokenKey)}
                              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}>
                              {isVisible ? <Icons.Eye /> : <Icons.EyeOff />}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }
            // group이 있는 경우: group별로 묶어서 헤더 + 필드 렌더링
            const groups = platform.fields.reduce((acc, field) => {
              const g = field.group || "";
              if (!acc.find(x => x.name === g)) acc.push({ name: g, fields: [] });
              acc.find(x => x.name === g).fields.push(field);
              return acc;
            }, []);
            const renderFieldInput = (field) => {
              const tokenKey = `${tokenPrefix}-${field.key}`;
              const isVisible = showTokens[tokenKey];
              return (
                <div key={field.key}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 6 }}>{field.label}</div>
                  <div style={{ position: "relative" }}>
                    <input
                      type={field.secret && !isVisible ? "password" : "text"}
                      style={{ ...styles.input, paddingRight: field.secret ? 38 : 14, fontFamily: field.secret && !isVisible ? "monospace" : "inherit" }}
                      placeholder={field.placeholder}
                      value={credentials[field.key] ?? ""}
                      onChange={(e) => onFieldChange(field.key, e.target.value)}
                    />
                    {field.secret && (
                      <button onClick={() => toggleTokenVisibility(tokenKey)}
                        style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}>
                        {isVisible ? <Icons.Eye /> : <Icons.EyeOff />}
                      </button>
                    )}
                  </div>
                </div>
              );
            };

            return groups.map(group => {
              // pair: "start" / "end" 로 묶인 필드는 한 세트 박스로 렌더링
              const rows = [];
              let fi = 0;
              while (fi < group.fields.length) {
                const f = group.fields[fi];
                const next = group.fields[fi + 1];
                if (f.pair === "start" && next?.pair === "end") {
                  rows.push(
                    <div key={`pair-${f.key}`} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderRadius: 8, border: `1px solid ${f.pairBorder ?? "#e0e4ef"}`, background: f.pairBg ?? "#f8fafc", overflow: "hidden", marginBottom: 4 }}>
                      <div style={{ padding: "12px 14px", borderRight: `2px solid ${f.pairBorder ?? "#c7d2fe"}` }}>
                        {renderFieldInput(f)}
                      </div>
                      <div style={{ padding: "12px 14px" }}>
                        {renderFieldInput(next)}
                      </div>
                    </div>
                  );
                  fi += 2;
                } else {
                  rows.push(<div key={f.key} style={{ marginBottom: 4 }}>{renderFieldInput(f)}</div>);
                  fi += 1;
                }
              }
              return (
                <div key={group.name} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, paddingBottom: 4, borderBottom: "1px solid #e8eaf0" }}>
                    {group.name}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {rows}
                  </div>
                </div>
              );
            });
          })()}
        </div>

        {/* 저장 버튼 */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10 }}>
          {saveStatus === "saved" && (
            <span style={{ fontSize: 12, color: "#10b981", display: "flex", alignItems: "center", gap: 4 }}>
              <Icons.Check /> 저장 완료
            </span>
          )}
          <button
            style={{
              ...styles.btn(true),
              opacity: saveStatus === "saving" ? 0.7 : 1,
              pointerEvents: saveStatus === "saving" ? "none" : "auto",
            }}
            onClick={onSave}
          >
            {saveStatus === "saving" ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    );

    return (
      <div>
        <div style={styles.pageTitle}>연동 관리</div>
        <div style={styles.pageSubtitle}>API 키를 입력하고 저장하세요. 키는 암호화되어 DB에 저장됩니다.</div>

        {/* 보안 안내 배너 */}
        <div style={{
          display: "flex", alignItems: "flex-start", gap: 12,
          padding: "14px 18px", borderRadius: 10, marginBottom: 24,
          background: "#fef9c3", border: "1px solid #fde68a",
        }}>
          <div style={{ fontSize: 18, flexShrink: 0 }}>🔐</div>
          <div style={{ fontSize: 13, color: "#78350f", lineHeight: 1.6 }}>
            <strong>보안 안내:</strong> API 키는 화면에 입력한 후 [저장] 버튼을 클릭해야 DB에 반영됩니다.
            입력된 키는 AES-256으로 암호화 저장되며, 소스코드(.env)에는 저장되지 않습니다.
          </div>
        </div>

        {/* 탭 */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "#f1f5f9", borderRadius: 10, padding: 4 }}>
          {[
            { id: "sns",     label: "SNS 연동",    icon: "📱" },
            { id: "service", label: "서비스 연동",  icon: "🔧" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setIntegrationTab(tab.id)}
              style={{
                flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 600,
                background: integrationTab === tab.id ? "#fff" : "transparent",
                color: integrationTab === tab.id ? "#1a1a2e" : "#64748b",
                boxShadow: integrationTab === tab.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s",
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* SNS 연동 탭 */}
        {integrationTab === "sns" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {snsOrder.map(id => {
              const platform = platformFields.find(p => p.id === id);
              if (!platform) return null;
              return renderCredentialCard({
                key: platform.id,
                platform,
                connected: isConnected(platform.id),
                saveStatus: snsSaveStatus[platform.id],
                credentials: snsCredentials[platform.id],
                onFieldChange: (fieldKey, value) => handleCredentialChange(platform.id, fieldKey, value),
                onSave: () => handleSave(platform.id),
                tokenPrefix: platform.id,
              });
            })}
          </div>
        )}

        {/* 서비스 연동 탭 */}
        {integrationTab === "service" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {Object.entries(serviceFields).map(([serviceKey, service]) => (
              <div key={serviceKey}>
                {renderCredentialCard({
                  key: serviceKey,
                  platform: service,
                  connected: isServiceConnected(serviceKey),
                  saveStatus: serviceSaveStatus[serviceKey],
                  credentials: serviceCredentials[serviceKey],
                  onFieldChange: (fieldKey, value) => handleServiceCredentialChange(serviceKey, fieldKey, value),
                  onSave: () => handleServiceSave(serviceKey),
                  tokenPrefix: `svc-${serviceKey}`,
                })}
                {/* Buffer 전용: 채널 확인 + 채널 목록 */}
                {serviceKey === "buffer" && serviceCredentials.buffer?.apiKey?.trim() && (
                  <div style={{ ...styles.card, marginTop: -8, borderTop: "none", borderTopLeftRadius: 0, borderTopRightRadius: 0, background: "#fafbfc" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: bufferChannels.length > 0 ? 16 : 0 }}>
                      <button
                        style={{ ...styles.btn(true), background: "#231F20", borderColor: "#231F20", fontSize: 13 }}
                        onClick={fetchBufferChannels}
                      >
                        🔄 Buffer 채널 확인
                      </button>
                      <span style={{ fontSize: 12, color: "#64748b" }}>Buffer에 연결된 SNS 채널을 조회합니다</span>
                    </div>
                    {bufferChannels.length > 0 && (
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 10 }}>연결된 채널 ({bufferChannels.length}개)</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
                          {bufferChannels.map(ch => (
                            <div key={ch.id} style={{
                              display: "flex", alignItems: "center", gap: 10,
                              padding: "10px 14px", borderRadius: 8,
                              border: `1px solid ${"#bbf7d0"}`,
                              background: "#f0fdf4",
                            }}>
                              <span style={{ fontSize: 16 }}>
                                {PLATFORMS[BUFFER_SERVICE_MAP[ch.service]]?.icon || "🌐"}
                              </span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  {ch.name}
                                </div>
                                <div style={{ fontSize: 11, color: "#94a3b8" }}>{ch.service}</div>
                              </div>
                              <span style={{
                                fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 100,
                                color: "#10b981",
                                background: "#d1fae5",
                              }}>
                                {"활성"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ========================
  // ========================
  //  PAGE: MEMBERS (회원 관리)
  // ========================
  const renderMembers = () => {
    const APPROVAL_COLORS = { pending: "#f59e0b", approved: "#10b981", rejected: "#ef4444" };
    const ROLE_COLORS = { admin: "#6366f1", operator: "#64748b" };

    const pendingCount = membersList.filter(m => m.approvalStatus === "pending").length;

    const updateApproval = async (id, val) => {
      setMembersList(prev => prev.map(m => m.id === id ? { ...m, approvalStatus: val } : m));
      await supabase.from("members").update({ approval_status: val }).eq("id", id);
    };
    const updateRole = async (id, val) => {
      setMembersList(prev => prev.map(m => m.id === id ? { ...m, role: val } : m));
      await supabase.from("members").update({ role: val }).eq("id", id);
    };
    const deleteMember = async (id, name) => {
      if (window.confirm(`"${name}"을(를) 삭제하시겠습니까?`)) {
        setMembersList(prev => prev.filter(m => m.id !== id));
        await supabase.from("members").delete().eq("id", id);
      }
    };

    const approvalSelectStyle = (status) => ({
      padding: "5px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer",
      border: `1px solid ${APPROVAL_COLORS[status] || "#e2e8f0"}`,
      background: (APPROVAL_COLORS[status] || "#94a3b8") + "18",
      color: APPROVAL_COLORS[status] || "#94a3b8",
      outline: "none", appearance: "none", WebkitAppearance: "none",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2394a3b8'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", paddingRight: 22,
    });

    const roleSelectStyle = (role) => ({
      padding: "5px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer",
      border: `1px solid ${role === "admin" ? "#c7d2fe" : "#e2e8f0"}`,
      background: role === "admin" ? "#6366f115" : "#f1f5f9",
      color: ROLE_COLORS[role] || "#64748b",
      outline: "none", appearance: "none", WebkitAppearance: "none",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2394a3b8'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", paddingRight: 22,
    });

    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={styles.pageTitle}>회원 관리</div>
            <div style={styles.pageSubtitle}>대시보드 접근 권한을 관리합니다</div>
          </div>
          {pendingCount > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10, background: "#fef3c7", border: "1px solid #fde68a" }}>
              <span style={{ fontSize: 14 }}>⏳</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#92400e" }}>승인 대기 {pendingCount}명</span>
            </div>
          )}
        </div>

        <div style={styles.card}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e8eaf0" }}>
                  {["No", "이름", "이메일 주소", "가입일", "승인 상태", "권한", "관리"].map(h => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: h === "관리" ? "center" : "left", fontSize: 11, fontWeight: 600, color: "#94a3b8", whiteSpace: "nowrap", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {membersList.map((member, i) => (
                  <tr key={member.id}
                    style={{ borderBottom: i < membersList.length - 1 ? "1px solid #f1f5f9" : "none" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fafbfd"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "14px 14px", color: "#94a3b8", whiteSpace: "nowrap" }}>{i + 1}</td>
                    <td style={{ padding: "14px 14px", fontWeight: 600, color: "#1a1a2e", whiteSpace: "nowrap" }}>{member.name}</td>
                    <td style={{ padding: "14px 14px", color: "#64748b" }}>{member.email}</td>
                    <td style={{ padding: "14px 14px", color: "#64748b", whiteSpace: "nowrap" }}>{member.joinedAt}</td>
                    <td style={{ padding: "14px 14px", whiteSpace: "nowrap" }}>
                      <select
                        value={member.approvalStatus}
                        onChange={e => updateApproval(member.id, e.target.value)}
                        style={approvalSelectStyle(member.approvalStatus)}
                      >
                        <option value="approved">승인 완료</option>
                        <option value="pending">가입 대기</option>
                        <option value="rejected">거부</option>
                      </select>
                    </td>
                    <td style={{ padding: "14px 14px", whiteSpace: "nowrap" }}>
                      <select
                        value={member.role}
                        onChange={e => updateRole(member.id, e.target.value)}
                        style={roleSelectStyle(member.role)}
                      >
                        <option value="admin">관리자</option>
                        <option value="operator">운영자</option>
                      </select>
                    </td>
                    <td style={{ padding: "14px 10px", whiteSpace: "nowrap", textAlign: "center" }}>
                      <button
                        style={{ ...styles.btnSm(false), fontSize: 11, padding: "4px 8px", color: "#ef4444", borderColor: "#fecaca" }}
                        onClick={() => deleteMember(member.id, member.name)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 회원가입/인증 구조 안내 */}
        <div style={{ ...styles.card, marginTop: 20, background: "linear-gradient(135deg, #f0f4ff, #faf5ff)", border: "1px solid #e0e7ff" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 12 }}>💡 회원가입 & 인증 구조 (Supabase Auth 연동 가이드)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { step: "1", title: "회원가입", desc: "이메일/비밀번호로 가입 → Supabase Auth 계정 생성 + members 테이블에 pending 상태로 등록" },
              { step: "2", title: "가입 대기", desc: "로그인 후 '관리자 승인 대기 중' 화면 표시. 대시보드 접근 불가" },
              { step: "3", title: "관리자 승인", desc: "관리자가 이 화면에서 [승인] 클릭 → approval_status = approved 업데이트" },
              { step: "4", title: "접근 허용", desc: "승인된 사용자만 대시보드 진입. 권한(관리자/운영자)에 따라 메뉴 차등 노출 가능" },
            ].map(s => (
              <div key={s.step} style={{ display: "flex", gap: 10 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#6366f1", color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.step}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 2 }}>{s.title}</div>
                  <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ========================
  //  RENDER PAGES
  // ========================
  const renderPage = () => {
    switch (activeMenu) {
      case "home": return renderHome();
      case "contents": return renderContents();
      case "community": return renderCommunity();
      case "research": return renderResearch();
      case "sns-integration": return renderSnsIntegration();
      case "members": return renderMembers();
      default: return renderHome();
    }
  };

  // ========================
  //  AUTH SCREENS
  // ========================
  const handleLogin = async () => {
    setAuthError("");
    if (!authForm.email || !authForm.password) { setAuthError("이메일과 비밀번호를 입력해주세요."); return; }
    const { error } = await supabase.auth.signInWithPassword({
      email: authForm.email,
      password: authForm.password,
    });
    if (error) { setAuthError("이메일 또는 비밀번호가 올바르지 않습니다."); return; }
    // 로그인 성공 후 승인 상태 확인
    const { data: memberData } = await supabase
      .from("members")
      .select("*")
      .eq("email", authForm.email)
      .single();
    if (!memberData || memberData.approval_status !== "approved") {
      setAuthState("pending");
    } else {
      setCurrentUser(memberData);
      setAuthState("approved");
    }
  };

  const handleSignup = async () => {
    setAuthError("");
    if (!authForm.name || !authForm.email || !authForm.password) { setAuthError("모든 항목을 입력해주세요."); return; }
    if (authForm.password.length < 8) { setAuthError("비밀번호는 8자 이상이어야 합니다."); return; }
    // Supabase Auth 계정 생성
    const { error } = await supabase.auth.signUp({
      email: authForm.email,
      password: authForm.password,
    });
    if (error) { setAuthError(error.message); return; }
    // members 테이블에 pending 상태로 등록
    await supabase.from("members").insert({
      name: authForm.name,
      email: authForm.email,
      approval_status: "pending",
      role: "operator",
      joined_at: new Date().toISOString().slice(0, 10),
    });
    setAuthState("pending");
  };

  const authCardStyle = { background: "#fff", borderRadius: 20, padding: "40px 44px", width: 400, boxShadow: "0 25px 50px rgba(0,0,0,0.35)" };

  if (authState === "loading") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "linear-gradient(195deg, #0f0f23 0%, #1a1a3e 100%)" }}>
        <div style={{ color: "#94a3b8", fontSize: 16 }}>로딩 중...</div>
      </div>
    );
  }

  if (authState === "logged-out") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "linear-gradient(195deg, #0f0f23 0%, #1a1a3e 100%)" }}>
        <div style={authCardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #818cf8, #c084fc)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#fff" }}>S</div>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e" }}>SNS 대시보드</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", marginBottom: 6 }}>로그인</div>
          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>관리자 승인을 받은 계정만 접근 가능합니다</div>
          {authError && <div style={{ padding: "10px 14px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#ef4444", fontSize: 12, marginBottom: 14 }}>{authError}</div>}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>이메일</div>
            <input style={styles.input} type="email" placeholder="이메일 주소" value={authForm.email} onChange={e => setAuthForm(p => ({ ...p, email: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>비밀번호</div>
            <input style={styles.input} type="password" placeholder="비밀번호" value={authForm.password} onChange={e => setAuthForm(p => ({ ...p, password: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>
          <button style={{ ...styles.btn(true), width: "100%", justifyContent: "center", padding: "12px" }} onClick={handleLogin}>
            로그인
          </button>
          <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#94a3b8" }}>
            계정이 없으신가요?{" "}
            <span style={{ color: "#6366f1", fontWeight: 600, cursor: "pointer" }} onClick={() => { setAuthForm({ email: "", password: "", name: "" }); setAuthError(""); setAuthState("signup"); }}>
              회원가입
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (authState === "signup") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "linear-gradient(195deg, #0f0f23 0%, #1a1a3e 100%)" }}>
        <div style={authCardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #818cf8, #c084fc)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#fff" }}>S</div>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e" }}>SNS 대시보드</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", marginBottom: 6 }}>회원가입</div>
          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>가입 후 관리자 승인이 완료되면 이용 가능합니다</div>
          {authError && <div style={{ padding: "10px 14px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#ef4444", fontSize: 12, marginBottom: 14 }}>{authError}</div>}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>이름</div>
            <input style={styles.input} placeholder="이름" value={authForm.name} onChange={e => setAuthForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>이메일</div>
            <input style={styles.input} type="email" placeholder="이메일 주소" value={authForm.email} onChange={e => setAuthForm(p => ({ ...p, email: e.target.value }))} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>비밀번호</div>
            <input style={styles.input} type="password" placeholder="비밀번호 (8자 이상)" value={authForm.password} onChange={e => setAuthForm(p => ({ ...p, password: e.target.value }))} />
          </div>
          <button style={{ ...styles.btn(true), width: "100%", justifyContent: "center", padding: "12px" }} onClick={handleSignup}>
            가입 신청
          </button>
          <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#94a3b8" }}>
            이미 계정이 있으신가요?{" "}
            <span style={{ color: "#6366f1", fontWeight: 600, cursor: "pointer" }} onClick={() => { setAuthForm({ email: "", password: "", name: "" }); setAuthError(""); setAuthState("logged-out"); }}>
              로그인
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (authState === "pending") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "linear-gradient(195deg, #0f0f23 0%, #1a1a3e 100%)" }}>
        <div style={{ ...authCardStyle, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>승인 대기 중</div>
          <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, marginBottom: 28 }}>
            가입 신청이 완료되었습니다.<br />
            관리자 승인 후 대시보드를 이용하실 수 있습니다.
          </div>
          <button style={{ ...styles.btn(false), width: "100%", justifyContent: "center" }} onClick={() => { setAuthState("logged-out"); setAuthForm({ email: "", password: "", name: "" }); }}>
            로그인 화면으로
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logo} onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #818cf8, #c084fc)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff", flexShrink: 0 }}>S</div>
          {!sidebarCollapsed && <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.02em" }}>SNS 대시보드</span>}
        </div>

        <div style={{ padding: "12px 0", flex: 1, overflowY: "auto" }}>
          {menuItems.map(item => (
            <div key={item.id} style={styles.menuItem(activeMenu === item.id)} onClick={() => setActiveMenu(item.id)}>
              <item.icon />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </div>
          ))}

          {/* 관리 섹션 구분선 */}
          <div style={{ borderTop: "1px solid #ffffff12", margin: "10px 0" }} />
          {!sidebarCollapsed && (
            <div style={{ padding: "4px 20px 6px", fontSize: 10, fontWeight: 600, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              관리
            </div>
          )}
          <div style={styles.menuItem(activeMenu === "sns-integration")} onClick={() => setActiveMenu("sns-integration")}>
            <Icons.Key />
            {!sidebarCollapsed && <span>연동 관리</span>}
          </div>
          <div style={styles.menuItem(activeMenu === "members")} onClick={() => setActiveMenu("members")}>
            <Icons.Settings />
            {!sidebarCollapsed && (
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                회원 관리
                {membersList.filter(m => m.approvalStatus === "pending").length > 0 && (
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 16, height: 16, borderRadius: 8, background: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 700, padding: "0 4px" }}>
                    {membersList.filter(m => m.approvalStatus === "pending").length}
                  </span>
                )}
              </span>
            )}
          </div>
        </div>

        <div style={{ borderTop: "1px solid #ffffff12", padding: "12px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: sidebarCollapsed ? "10px 18px" : "10px 20px", cursor: "pointer" }}
            onClick={async () => { await supabase.auth.signOut(); setCurrentUser(null); setAuthState("logged-out"); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {!sidebarCollapsed && <span style={{ fontSize: 13, color: "#94a3b8" }}>로그아웃</span>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {renderPage()}
      </div>
    </div>
  );
}
