/* CONFIGURAÇÃO DE CONTATO
   Informe UM dos canais abaixo antes de publicar.
   whatsapp: somente dígitos, incluindo país e DDD. Ex.: '5511999999999'
   email: endereço real da consultoria.
   O formulário NÃO armazena nem envia dados a um servidor.
*/
const CONTACT = {
  whatsapp: '5511947622105',
  email: 'contatoletmeknow@gmail.com'
};

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
}));
document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const nome = document.getElementById('nome').value.trim();
  const empresa = document.getElementById('empresa').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();
  const texto = `Olá, Priscila! Meu nome é ${nome}.${empresa ? ` Empresa: ${empresa}.` : ''} Telefone: ${telefone}.\n\n${mensagem}`;
  const status = document.getElementById('form-status');
  if (CONTACT.whatsapp) {
    if (!/^\d{10,15}$/.test(CONTACT.whatsapp)) { status.textContent = 'O WhatsApp configurado é inválido. Verifique o arquivo script.js.'; return; }
    status.textContent = 'Abrindo o WhatsApp com sua mensagem...';
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener,noreferrer');
  } else if (CONTACT.email) {
    status.textContent = 'Abrindo seu aplicativo de e-mail...';
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent('Contato pelo site Let Me Know')}&body=${encodeURIComponent(texto)}`;
  } else {
    status.textContent = 'O contato ainda não foi configurado. Insira o WhatsApp ou e-mail da empresa no arquivo script.js antes de publicar.';
  }
});
