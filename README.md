# VirtuFit Widget

Виджет виртуальной примерки (React 19 + TanStack Start).

## Локальный запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:8080](http://localhost:8080) (порт смотри в выводе `npm run dev`).

**Прод:** https://tanstack-start-app.virtufit-widget.workers.dev

Подробный гайд для агента: [docs/AGENT-DEPLOY-GUIDE.md](docs/AGENT-DEPLOY-GUIDE.md)

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

Локальный деплой (на Windows часто нестабилен из‑за размера ассетов — лучше через GitHub Actions):

```bash
npm run deploy
```
