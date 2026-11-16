(() => {
  'use strict';
  const output = document.getElementById('visit-count');
  if (!output) return;

  // Serviço gratuito e público. Não use a chave para dados privados.
  const key = 'lmkconsultoria_com_br_visitas_20261116_v1';
  const base = 'https://countapi.mileshilliard.com/api/v1';
  const storageKey = 'lmk_last_counted_at_v13';
  const interval = 12 * 60 * 60 * 1000;
  const format = number => new Intl.NumberFormat('pt-BR').format(number);

  async function request(action) {
    const response = await fetch(`${base}/${action}/${key}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Erro HTTP ' + response.status);
    const data = await response.json();
    if (!Number.isFinite(Number(data.value))) throw new Error('Resposta inválida');
    return Number(data.value);
  }

  async function start() {
    output.textContent = '…';
    let previous = 0;
    try { previous = Number(localStorage.getItem(storageKey)) || 0; } catch (_) {}
    const now = Date.now();
    const shouldCount = !previous || now - previous >= interval || previous > now;
    try {
      const value = await request(shouldCount ? 'hit' : 'get');
      if (shouldCount) {
        try { localStorage.setItem(storageKey, String(Date.now())); } catch (_) {}
      }
      output.textContent = format(value);
    } catch (error) {
      // Não exibir número fictício quando o serviço externo estiver indisponível.
      output.textContent = 'Indisponível';
      console.warn('Contador Let Me Know:', error);
    }
  }
  start();
})();
