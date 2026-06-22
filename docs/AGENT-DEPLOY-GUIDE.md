# Гайд для агента: деплой VirtuFit Widget

Краткая инструкция, чтобы быстро залить проект в GitHub и опубликовать в интернете.

---

## Контекст проекта

| Параметр | Значение |
|----------|----------|
| Путь | `design-to-widget-magic-main/` (внутри workspace) |
| Стек | React 19, TanStack Start, Vite 7, Tailwind 4 |
| Хостинг | **Cloudflare Workers** (SSR, не GitHub Pages) |
| Репозиторий | https://github.com/controlllRR/design-to-widget-magic-main |
| Прод URL | https://tanstack-start-app.virtufit-widget.workers.dev |
| Ветка деплоя | `main` |

**Важно:** это SSR-приложение (TanStack Start + Nitro). Статический GitHub Pages **не подходит** без отдельной настройки prerender.

---

## Быстрый чеклист (уже настроенный репозиторий)

Если секреты в GitHub уже есть — достаточно:

```bash
cd design-to-widget-magic-main
git add .
git commit -m "описание изменений"
git push origin main
```

GitHub Actions (`.github/workflows/deploy.yml`) сам соберёт и задеплоит.  
Проверка: https://github.com/controlllRR/design-to-widget-magic-main/actions

Ручной запуск: Actions → **Deploy to Cloudflare Workers** → **Run workflow**.

---

## Первичная настройка с нуля

### 1. Git

```bash
cd design-to-widget-magic-main
git init -b main
git remote add origin https://github.com/controlllRR/design-to-widget-magic-main.git
```

**Не коммитить:** `node_modules/`, `dist/`, `.env`, `tmp-*.py`, API-токены.

`.gitignore` уже настроен.

### 2. Cloudflare

1. Аккаунт: https://dash.cloudflare.com  
2. **Account ID:** Workers & Pages → Overview (правая колонка)  
3. **API Token:** Profile → API Tokens → шаблон **Edit Cloudflare Workers**

Токен должен уметь:
- читать список аккаунтов (`/accounts`);
- деплоить Workers;
- загружать assets.

Токен **нельзя** отправлять в чат, коммитить или писать в файлы репозитория.

### 3. GitHub Secrets

Репозиторий → **Settings → Secrets and variables → Actions**:

| Secret | Значение |
|--------|----------|
| `CLOUDFLARE_API_TOKEN` | токен из п.2 |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID из п.2 |

### 4. Проверка токена (опционально)

```bash
curl -s -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  https://api.cloudflare.com/client/v4/user/tokens/verify

curl -s -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  https://api.cloudflare.com/client/v4/accounts
```

В ответе `/accounts` должен быть хотя бы один аккаунт. Если пусто — у токена нет прав.

---

## Как устроен деплой

### Сборка

`vite.config.ts` содержит `nitro: true` — без этого не генерируется `dist/server/wrangler.json`.

```bash
npm install
npm run build
```

Артефакты:
- `dist/client/` — статика (~150+ MB, много PNG/MP4)
- `dist/server/` — Worker + `wrangler.json`

### CI workflow

Файл: `.github/workflows/deploy.yml`

Шаги:
1. `npm install` (не `npm ci` — на этом проекте `npm ci` падал в CI)
2. `npm run build`
3. Регистрация subdomain `virtufit-widget` через Cloudflare API
4. `npx wrangler deploy --config dist/server/wrangler.json`

Таймаут job: **60 минут** (загрузка ассетов может занять время).

### Прод URL

Формат: `https://<worker-name>.<subdomain>.workers.dev`

Сейчас: `tanstack-start-app` + `virtufit-widget` →  
**https://tanstack-start-app.virtufit-widget.workers.dev**

---

## Локальный деплой (запасной путь)

```bash
export CLOUDFLARE_API_TOKEN="..."
export CLOUDFLARE_ACCOUNT_ID="..."
npm run deploy
```

Скрипт в `package.json`: `build && wrangler deploy --config dist/server/wrangler.json`.

**Известная проблема:** с Windows локально `wrangler deploy` часто падает с `terminated` при загрузке ~150+ MB ассетов (таймаут сети). **Предпочитай GitHub Actions** — там деплой стабильнее.

---

## Частые ошибки и фиксы

| Симптом | Причина | Решение |
|---------|---------|---------|
| CI падает на `npm ci` за 3 сек | lockfile / окружение | В workflow уже `npm install` |
| Workflow не стартует, instant Failure | `secrets` в `if:` в YAML | Нельзя: `if: secrets.X != ''`. Убрать условия |
| `Authentication error [code: 10000]` | Слабый API-токен | Пересоздать по шаблону Edit Cloudflare Workers |
| `terminated` при asset upload | Большие ассеты + сеть | Деплой через GitHub Actions; убрать лишние файлы из `public/` |
| Worker 404 / нет subdomain | Первый деплой без subdomain | Шаг `Register workers.dev subdomain` в workflow |
| Сайт не обновился | Старый кэш | Подожди 1–2 мин; проверь последний green run в Actions |

---

## Локальная разработка (не прод)

```bash
npm install
npm run dev
```

Dev-сервер: **http://localhost:8080/** (порт может отличаться — смотри вывод терминала).

Локальный dev **не нужен** для работы прод-сайта. Прод на Cloudflare работает при выключенном ПК.

---

## Что агенту делать после изменений кода

1. Убедиться, что `npm run build` проходит локально (если возможно).
2. Закоммитить только нужные файлы (без секретов, без `dist/`, без `tmp-*.py`).
3. `git push origin main`.
4. Дождаться green workflow в Actions (~1–3 мин).
5. Открыть https://tanstack-start-app.virtufit-widget.workers.dev и проверить.

---

## Ключевые файлы

```
vite.config.ts              # nitro: true обязателен
.github/workflows/deploy.yml
package.json                # scripts: build, deploy
wrangler.jsonc              # legacy; CI использует dist/server/wrangler.json
.gitignore
```

---

## Безопасность

- Никогда не коммитить `.env`, токены Cloudflare/GitHub.
- Если токен попал в чат — **отозвать** в Cloudflare и выпустить новый.
- `CLOUDFLARE_*` только в GitHub Secrets или локальных env-переменных.

---

## Команды одной строкой (шпаргалка)

```bash
# Прод: залить изменения
git add -A && git commit -m "..." && git push origin main

# Проверить прод
curl -I https://tanstack-start-app.virtufit-widget.workers.dev

# Локально
npm install && npm run dev
```
