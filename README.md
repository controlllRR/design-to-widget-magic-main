# VirtuFit Widget

Виджет виртуальной примерки (React 19 + TanStack Start).

## Локальный запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:5173](http://localhost:5173).

## Сборка

```bash
npm run build
```

## Деплой (Cloudflare Workers)

1. Создайте API-токен в [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens) с правами **Edit Cloudflare Workers**.
2. В настройках репозитория GitHub → **Secrets and variables → Actions** добавьте:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID` (на странице Workers → Overview)
3. Запушьте в ветку `main` — workflow `.github/workflows/deploy.yml` задеплоит приложение.

Локальный деплой:

```bash
npm run build
npx wrangler deploy
```
