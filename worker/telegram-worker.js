export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders() });
    }
    try {
      const data = await request.json();
      const phone = String(data.phone || '').trim();
      const source = String(data.source || '').trim();
      if (!phone) return new Response('Phone required', { status: 400, headers: corsHeaders() });
      const text = `Новая заявка с сайта ЦОР ОСНОВА\n\nТелефон: ${phone}\nСтраница: ${source}`;
      const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
      const tg = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text })
      });
      if (!tg.ok) return new Response('Telegram error', { status: 502, headers: corsHeaders() });
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders(), 'Content-Type': 'application/json' } });
    } catch (e) {
      return new Response('Bad request', { status: 400, headers: corsHeaders() });
    }
  }
}
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}
