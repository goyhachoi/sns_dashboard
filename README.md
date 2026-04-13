# SNS 대시보드 스터디

Facebook, X(Twitter), Instagram, Threads, YouTube 콘텐츠를 한 곳에서 관리하고 발행하는 SNS 대시보드입니다.

## 기술 스택

- **Frontend**: React + Vite (JSX)
- **Backend/DB**: Supabase (PostgreSQL)
- **AI**: OpenAI API (초안 자동 생성)
- **배포**: Vercel

---

## 시작하기

### 1단계. 저장소 클론

```bash
git clone https://github.com/koanestory-cloud/sns-dashboard-study.git
cd sns-dashboard-study
npm install
```

### 2단계. 환경변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열어 본인의 Supabase 키를 입력합니다.

> ⚡ **Supabase 키 없이도 실행 가능합니다.**
> `.env` 미설정 시 샘플 데이터로 UI를 먼저 확인할 수 있습니다.

### 3단계. 로컬 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

---

## Supabase 프로젝트 세팅

Supabase와 연결하려면 아래 단계를 따라주세요.

### 1. Supabase 프로젝트 생성

1. [supabase.com](https://supabase.com) 접속 → 회원가입/로그인
2. **New Project** 클릭 → 프로젝트 이름, 비밀번호 설정
3. **Project Settings → API** 에서 아래 값을 복사

```
Project URL     → VITE_SUPABASE_URL
anon public key → VITE_SUPABASE_ANON_KEY
```

### 2. 테이블 생성

Supabase **SQL Editor**에서 아래 SQL을 순서대로 실행합니다.

#### contents 테이블
```sql
create table contents (
  id bigint generated always as identity primary key,
  title text,
  master_text text,
  status text default 'draft',
  scheduled_at timestamptz,
  platforms text[],
  platform_drafts jsonb default '{}',
  publish_results jsonb default '{}',
  registrant text,
  registered_at text,
  first_published_at timestamptz,
  updated_at timestamptz
);
```

#### sns_credentials 테이블
```sql
create table sns_credentials (
  platform text primary key,
  credentials jsonb not null default '{}',
  is_connected boolean default false,
  updated_at timestamptz default now()
);
```

#### service_credentials 테이블
```sql
create table service_credentials (
  service text primary key
    check (service in ('supabase', 'github', 'vercel', 'googleSheet', 'openai')),
  credentials jsonb not null default '{}',
  is_connected boolean default false,
  updated_at timestamptz default now()
);
```

#### settings 테이블
```sql
create table settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- RLS 비활성화 (내부 대시보드용)
alter table settings disable row level security;
```

#### members 테이블
```sql
create table members (
  id bigint generated always as identity primary key,
  name text,
  email text unique,
  joined_at text,
  approval_status text default 'pending',
  role text default 'operator'
);
```

### 3. .env 파일 업데이트

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 콘텐츠 관리 | 글쓰기, 목록, 캘린더 |
| 초안 자동 생성 | OpenAI API로 SNS별 초안 자동 작성 |
| 즉시/예약 발행 | X(Twitter) 즉시 발행 지원 |
| AI 작성 도구 | ChatGPT, Gemini 등 외부 도구 바로가기 |
| 연동 관리 | SNS API 키, OpenAI API 키 관리 |
| 회원 관리 | 팀원 초대 및 권한 관리 |

---

## SNS 발행 연동

각 플랫폼 API 키는 **연동 관리 → SNS 연동** 메뉴에서 입력합니다.

### X (Twitter) 발행을 위해 필요한 키
- Consumer Key / Consumer Key Secret
- Access Token / Access Token Secret

### OpenAI 초안 생성을 위해 필요한 키
- **연동 관리 → 서비스 연동 → OpenAI**에서 API 키 입력
- [platform.openai.com/api-keys](https://platform.openai.com/api-keys)에서 발급

---

## 폴더 구조

```
sns-dashboard-study/
├── dashboard.jsx       # 메인 대시보드 컴포넌트
├── main.jsx            # React 진입점
├── supabase.js         # Supabase 클라이언트
├── index.html
├── vite.config.js
├── package.json
├── .env.example        # 환경변수 템플릿
└── .gitignore
```
