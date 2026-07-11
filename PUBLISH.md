# Публикация marketscore-wordstat-mcp — чек-лист владельца

Репо собрано и закоммичено локально. Ниже — шаги, требующие **ваших** доступов
(GitHub-аккаунт `marketscore`, npm с 2FA, `mcp-publisher`). Порядок важен: GitHub → npm →
MCP Registry → каталоги. Опыт вобран из публикации `marketscore-direct-mcp`.

## 0. Предпосылки на сервере — НИЧЕГО делать не нужно

Хостовый `/api/mcp` уже обслуживает wordstat-only юзеров: free/business с балансом
пакетов получают ровно 2 инструмента (`wordstat_suggest`, `wordstat_dynamics`),
подключение по OAuth. Серверных правок и деплоя для этой публикации **не требуется**.

## 1. GitHub

Создать публичный репозиторий `marketscore/marketscore-wordstat-mcp` (в аккаунте
`marketscore`), затем:

```bash
cd ~/Desktop/marketscore-wordstat-mcp
git remote add origin https://github.com/marketscore/marketscore-wordstat-mcp.git
git push -u origin main
```

CI (`.github/workflows/ci.yml`) прогонит синтакс-чек CLI и валидацию манифестов.

## 2. npm

Аккаунт с 2FA → обычный `npm publish` и granular-токен дают 403 «2FA bypass required».
Рабочие пути (любой на выбор):

- **Classic Automation-токен** (сработал для direct-коннектора):
  ```bash
  cd ~/Desktop/marketscore-wordstat-mcp
  echo "//registry.npmjs.org/:_authToken=npm_ВАШ_AUTOMATION_ТОКЕН" > .npmrc
  npm publish --access public
  rm .npmrc
  ```
- **или** обычный вход + одноразовый код: `npm publish --access public --otp=КОД`.

Проверка после публикации: `npx -y marketscore-wordstat-mcp --version` → `1.0.0`.

## 3. Официальный MCP Registry

```bash
cd ~/Desktop/marketscore-wordstat-mcp
mcp-publisher login github        # токен истекает быстро — логиниться прямо перед publish
mcp-publisher publish             # прочитает server.json (io.github.marketscore/marketscore-wordstat-mcp)
```

`server.json` уже содержит и npm-пакет, и remote-URL — запись выйдет сразу с обоими
транспортами (в отличие от direct, где npm добавили позже). Downstream-каталоги
(mcp.so / PulseMCP / Glama) синхронизируются из реестра сами.

## 4. Каталоги

- **awesome-mcp-servers** — PR со строкой в раздел (маркетинг/SEO или «Search»):
  `[marketscore-wordstat-mcp](https://github.com/marketscore/marketscore-wordstat-mcp) — Yandex Wordstat keyword research (frequencies + 24-month seasonality) in Claude/ChatGPT.`
- **Glama** — ручной «Add Server» (репо уже содержит `glama.json` с maintainer `marketscore`).
- **Smithery** — ручной «Add Server» по URL репозитория.
- **mcp.so / PulseMCP** — подтянутся из MCP Registry автоматически; если нет — ручная заявка.

## 5. Обновление версии в будущем

Бамп `version` в `package.json` + `server.json` (держать синхронно) →
`git push` → `npm publish` (--otp/Automation) → `mcp-publisher login github` +
`mcp-publisher publish`. Записи реестра неизменяемы — новая версия = новая публикация.

## Грабли (из опыта direct-коннектора)

- Коннектор claude.ai **кэширует список инструментов** на момент подключения. Тут не
  критично (набор из 2 инструментов стабилен), но при смене состава — переподключить.
- `mcp-publisher` требует свежий `login github` — токен живёт недолго.
- npm 2FA не обходится granular-токеном — только Classic Automation или `--otp`.
