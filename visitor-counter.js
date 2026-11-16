(() => {
  'use strict';
  const element = document.getElementById('visit-count');
  const endpoint = (window.LMK_VISIT_API || '').replace(/\/$/, '');
  if (!element) return;
  if (!endpoint) { element.textContent = 'Aguardando ativação'; return; }
  const start = Date.parse('2026-11-16T03:00:00Z');
  if (Date.now() < start) { element.textContent = 'Aguardando ativação'; return; }
  let id;
  try {
    id = localStorage.getItem('lmk_visitor_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('lmk_visitor_id', id);
    }
  } catch { element.textContent = 'Indisponível'; return; }
  fetch(endpoint + '/visit', {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ visitorId: id }), cache: 'no-store'
  }).then(async response => {
    if (!response.ok) throw new Error('Falha na contagem');
    return response.json();
  }).then(data => {
    element.textContent = new Intl.NumberFormat('pt-BR').format(data.count);
  }).catch(() => { element.textContent = 'Indisponível'; });
})();
