import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 환경변수가 없거나 기본값이면 데모 모드
export const DEMO_MODE =
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl === "https://your-project-ref.supabase.co";

// 데모 모드일 때 더미 클라이언트 (에러 방지용)
const dummyClient = {
  from: () => ({
    select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
    insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: { message: "데모 모드: Supabase 미연결" } }) }) }),
    update: () => ({ eq: () => Promise.resolve({ error: { message: "데모 모드: Supabase 미연결" } }) }),
    upsert: () => Promise.resolve({ error: null }),
    delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
    eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }),
  }),
  functions: {
    invoke: () => Promise.resolve({ data: null, error: { message: "데모 모드: Supabase 미연결" } }),
  },
};

export const supabase = DEMO_MODE
  ? dummyClient
  : createClient(supabaseUrl, supabaseAnonKey);
