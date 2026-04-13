import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { query, variables, apiKey } = await req.json();
    if (!query) {
      return json({ error: "GraphQL query가 필요합니다" }, 400);
    }
    if (!apiKey) {
      return json({ error: "Buffer API Key가 필요합니다" }, 400);
    }

    // Buffer GraphQL API 호출 (서버 사이드 — CORS 없음)
    const bufferResp = await fetch("https://api.buffer.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    const bufferData = await bufferResp.json();
    return json(bufferData);
  } catch (e) {
    return json({ error: e.message }, 500);
  }
});
