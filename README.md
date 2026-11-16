# Let Me Know, Revisão 13 — contador gratuito na web

O contador foi integrado ao serviço público gratuito CountAPI (https://countapi.mileshilliard.com/), sem Cloudflare ou banco de dados próprio. É exibido ao lado do logotipo no cabeçalho.

## Como publicar

Envie os arquivos `index.html` e `visitor-counter.js` atualizados para a raiz do repositório GitHub Pages. Os demais arquivos da Revisão 12 foram preservados.

A contagem começa com a primeira visita após a publicação. O serviço guarda o total de forma compartilhada, enquanto o navegador usa `localStorage` para limitar a uma chamada de incremento a cada 12 horas. Se o visitante usar outro navegador, dispositivo, navegação privada ou apagar os dados, poderá ser contabilizado novamente. O limite de 12 horas não é validado no servidor e pode sofrer contagens artificiais; trata-se de aproximação de visitantes, não pessoas únicas verificadas.

O serviço externo pode ficar indisponível ou mudar suas regras. Quando isso ocorrer, o contador mostra `Indisponível`, não um número inventado. As requisições enviam informações de conexão ao serviço externo; avalie atualizar o aviso de privacidade do site.

O contador não é ativado nesta cópia local nem no site público até que os arquivos sejam publicados. Não foi criado nenhum número inicial fictício.
