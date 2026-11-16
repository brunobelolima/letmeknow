// Contador de visitas únicas por navegador, com intervalo mínimo de 12h.
// Cloudflare Workers + D1, com início às 00h de Brasília em 16/11/2026.
const START = Date.parse('2026-11-16T03:00:00Z');
const WINDOW = 12 * 60 * 60 * 1000;
const ALLOWED_ORIGINS = new Set([
  'https://www.lmkconsultoria.com.br',
  'https://lmkconsultoria.com.br',
  'https://brunobelolima.github.io'
]);
function reply(body, status, origin) {
  const headers = {'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store', 'Vary':'Origin'};
  if (ALLOWED_ORIGINS.has(origin)) headers['Access-Control-Allow-Origin'] = origin;
  return new Response(JSON.stringify(body), {status, headers});
}
export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const path = new URL(request.url).pathname;
    if (request.method === 'OPTIONS') {
      if (!ALLOWED_ORIGINS.has(origin)) return new Response(null, {status:403});
      return new Response(null, {status:204, headers:{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'86400'}});
    }
    if (path !== '/visit' || request.method !== 'POST') return reply({error:'Not found'},404,origin);
    if (!ALLOWED_ORIGINS.has(origin)) return reply({error:'Origin not allowed'},403,origin);
    if (!env.DB) return reply({error:'Database not configured'},503,origin);
    if (Date.now() < START) return reply({count:0,started:false},200,origin);
    let payload;
    try { payload = await request.json(); } catch { return reply({error:'Invalid JSON'},400,origin); }
    const id = payload?.visitorId;
    if (typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return reply({error:'Invalid visitor ID'},400,origin);
    // Hash prevents storing raw browser identifiers in the database.
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(id));
    const hashed = Array.from(new Uint8Array(digest), x => x.toString(16).padStart(2,'0')).join('');
    const now = Date.now();
    try {
      // A única operação de escrita que conta a visita é condicional e atômica.
      const result = await env.DB.prepare(`INSERT INTO visitors(visitor_id,last_counted_at)
        VALUES (?,?) ON CONFLICT(visitor_id) DO UPDATE SET last_counted_at=excluded.last_counted_at
        WHERE visitors.last_counted_at <= ? RETURNING visitor_id`)
        .bind(hashed, now, now - WINDOW).first();
      if (result) await env.DB.prepare('INSERT INTO visit_events(visitor_id,counted_at) VALUES (?,?)').bind(hashed,now).run();
      const total = await env.DB.prepare('SELECT COUNT(*) AS total FROM visit_events WHERE counted_at >= ?').bind(START).first();
      return reply({count:total?.total ?? 0,started:true},200,origin);
    } catch (error) {
      console.error('Counter error', error);
      return reply({error:'Counter unavailable'},503,origin);
    }
  }
};
