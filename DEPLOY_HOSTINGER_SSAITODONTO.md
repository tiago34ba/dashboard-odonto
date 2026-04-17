# Deploy Hostinger - SSait Odonto em /ssaitodonto

Este projeto foi ajustado para publicar o frontend em `https://www.ssaitecnologia.com.br/ssaitodonto`.

## Estrutura recomendada

- Frontend React: `https://www.ssaitecnologia.com.br/ssaitodonto`
- Backend Laravel: `https://www.ssaitecnologia.com.br/ssaitodonto-api`

## Frontend

1. No diretório `dashboard-odonto`, rode:

```powershell
npm install
npm run build
```

2. O arquivo `.env.production` já aponta para:

```env
PUBLIC_URL=/ssaitodonto
REACT_APP_BASENAME=/ssaitodonto
REACT_APP_API_BASE_URL=https://www.ssaitecnologia.com.br/ssaitodonto-api/api
```

3. Envie o conteúdo da pasta `build/` para a pasta `public_html/ssaitodonto/` na Hostinger.

4. O arquivo `.htaccess` em `public/.htaccess` deve ficar dentro da pasta publicada `public_html/ssaitodonto/.htaccess`.

## Backend

1. Publique o projeto Laravel fora da pasta pública, por exemplo:

```text
/home/USUARIO/odonto
```

2. Publique somente o conteúdo da pasta `public/` do Laravel em:

```text
/home/USUARIO/public_html/ssaitodonto-api
```

3. Ajuste o `index.php` publicado, se necessário, para apontar para os diretórios reais `vendor` e `bootstrap` do projeto Laravel.

4. Configure o `.env` do backend com estes valores base:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://www.ssaitecnologia.com.br/ssaitodonto-api

FRONTEND_URL=https://www.ssaitecnologia.com.br
DASHBOARD_URL=https://www.ssaitecnologia.com.br/ssaitodonto
CORS_ALLOWED_ORIGINS=https://www.ssaitecnologia.com.br,https://ssaitecnologia.com.br

SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax
```

5. Depois rode no backend:

```powershell
composer install --no-dev --optimize-autoloader
php artisan key:generate
php artisan migrate --force
php artisan storage:link
php artisan optimize
```

## Checklist

1. Abrir `https://www.ssaitecnologia.com.br/ssaitodonto`
2. Recarregar uma rota interna, por exemplo `https://www.ssaitecnologia.com.br/ssaitodonto/login`
3. Validar login e chamadas da API
4. Testar se `https://www.ssaitecnologia.com.br/ssaitodonto-api/api` responde pelo Laravel