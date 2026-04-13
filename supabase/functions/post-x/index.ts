import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    if (!text?.trim()) {
      return json({ error: "발행할 텍스트가 없습니다" }, 400);
    }

    // Supabase에서 X 인증키 조회 (Service Role Key 사용)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data, error } = await supabase
      .from("sns_credentials")
      .select("credentials")
      .eq("platform", "twitter")
      .single();

    if (error || !data) {
      return json({ error: "X 인증키를 찾을 수 없습니다. 연동 관리에서 저장해주세요." }, 404);
    }

    const creds = data.credentials;
    // 필드명 정규화 (DB 저장명 → Edge Function 내부명)
    const normalized = {
      consumerKey: creds.consumerKey,
      consumerKeySecret: creds.consumerKeySecret ?? creds.consumerSecret,
      accessToken: creds.accessToken,
      accessTokenSecret: creds.accessTokenSecret ?? creds.accessSecret,
    };

    const required = ["consumerKey", "consumerKeySecret", "accessToken", "accessTokenSecret"];
    const missing = required.filter((k) => !normalized[k]);
    if (missing.length) {
      return json({ error: `누락된 키: ${missing.join(", ")}` }, 400);
    }

    // X API v2 트윗 발행 (OAuth 1.0a)
    const tweetId = await postTweet(text.trim(), normalized);
    return json({ success: true, id: tweetId, url: `https://x.com/i/web/status/${tweetId}` });

  } catch (e) {
    return json({ error: e.message }, 500);
  }
});

// ---------- X API 발행 ----------

async function postTweet(text: string, creds: Record<string, string>): Promise<string> {
  const url = "https://api.twitter.com/2/tweets";

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: creds.consumerKey,
    oauth_nonce: generateNonce(),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: String(Math.floor(Date.now() / 1000)),
    oauth_token: creds.accessToken,
    oauth_version: "1.0",
  };

  const signature = await sign(
    "POST", url, oauthParams,
    creds.consumerKeySecret, creds.accessTokenSecret
  );

  const authHeader = "OAuth " +
    Object.entries({ ...oauthParams, oauth_signature: signature })
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${pct(k)}="${pct(v)}"`)
      .join(", ");

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  const result = await resp.json();
  if (!resp.ok) throw new Error(`X API ${resp.status}: ${JSON.stringify(result)}`);
  return result.data.id;
}

// ---------- OAuth 1.0a 서명 ----------

function generateNonce(): string {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return Array.from(b).map((x) => x.toString(16).padStart(2, "0")).join("");
}

function pct(s: string): string {
  return encodeURIComponent(s);
}

async function sign(
  method: string,
  url: string,
  oauthParams: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string
): Promise<string> {
  const paramStr = Object.keys(oauthParams)
    .sort()
    .map((k) => `${pct(k)}=${pct(oauthParams[k])}`)
    .join("&");

  const base = `${pct(method)}&${pct(url)}&${pct(paramStr)}`;
  const key = `${pct(consumerSecret)}&${pct(tokenSecret)}`;

  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw", enc.encode(key),
    { name: "HMAC", hash: "SHA-1" },
    false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(base));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

// ---------- 응답 헬퍼 ----------

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
