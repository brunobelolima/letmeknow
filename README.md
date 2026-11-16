# Let Me Know | Revisão 8: contador de visitas

Inclui contador no rodapé com início em **16/11/2026, 00h (Brasília)** e **no máximo uma visita contabilizada por navegador a cada 12 horas**. Mantém SEO e remove o aviso de resultados solicitado na Revisão 7.

## Importante
O GitHub Pages é estático. Para persistência real entre visitantes, é necessário implantar o backend Cloudflare Worker + D1 (plano gratuito dentro das cotas). **O contador não funciona apenas enviando o ZIP ao GitHub.** Enquanto o backend não estiver configurado, aparecerá "Aguardando ativação". Não são exibidos números fictícios.

## Implantar backend
1. Crie uma conta Cloudflare e instale o Wrangler: `npm install -g wrangler`.
2. Faça login: `wrangler login`.
3. Entre na pasta `cloudflare-worker` e crie o banco: `wrangler d1 create lmk-visits`.
4. Copie o `database_id` retornado para `wrangler.toml` e descomente o bloco `[[d1_databases]]`.
5. Execute `wrangler d1 execute lmk-visits --remote --file=schema.sql`.
6. Publique: `wrangler deploy`.
7. No `index.html`, substitua `window.LMK_VISIT_API = ""` pela URL HTTPS do Worker, **sem barra final**, por exemplo `https://lmk-visit-counter.SEU_SUBDOMINIO.workers.dev`.
8. Publique `index.html`, `visitor-counter.js` e `styles.css` no repositório GitHub, preservando os demais arquivos.

## Critério de contagem
Cada navegador recebe um identificador aleatório salvo em localStorage. O Worker armazena apenas o hash SHA-256 desse identificador. A primeira visita após o início conta uma vez; novas visitas do mesmo navegador só contam após transcorridas 12 horas desde a última visita contabilizada. Navegadores/dispositivos diferentes contam separadamente. Apagar o armazenamento do navegador pode gerar nova contagem. Não é uma métrica antifraude nem equivale a pessoas únicas verificadas.

## Privacidade e limitações
A contagem utiliza identificador persistente de navegador; revise a política de privacidade e obrigações de consentimento aplicáveis antes da ativação. A origem permitida no Worker limita uso normal no navegador, mas não impede requisições automatizadas falsificadas. Falhas temporárias entre gravação do visitante e evento podem causar subcontagem. O total histórico não é apagado a cada 12 horas.

## Revisão 9
O contador foi movido do rodapé para o canto superior direito do cabeçalho. A lógica de visitas únicas por navegador a cada 12 horas e o início em 16/11/2026 às 00h (Brasília) permanecem inalterados. Para ativar a contagem real, configure o Worker/D1 e a URL `window.LMK_VISIT_API` em `index.html`.

## Revisão 10
A data de início não aparece mais na interface do contador, nem na mensagem antes do início. O início interno de 16/11/2026 às 00h (Brasília) e a regra de 12 horas permanecem preservados.
