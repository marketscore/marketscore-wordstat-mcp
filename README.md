# Wordstat MCP — подбор слов Яндекса в Claude и ChatGPT

[![npm version](https://img.shields.io/npm/v/marketscore-wordstat-mcp)](https://www.npmjs.com/package/marketscore-wordstat-mcp)
[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

> Подключите **Claude** или **ChatGPT** к Яндекс Вордстату и собирайте семантику прямо в диалоге: «Собери частотности и сезонность по запросу “купить пылесос”» → ассистент вернёт похожие фразы с частотностями, отсеет мусор и покажет, когда у ниши сезонный пик.
>
> Connect Claude or ChatGPT to Yandex Wordstat and do keyword research in chat — frequencies, related phrases, noise filtering, and 24-month seasonality.

**[Попробовать — 1 запрос бесплатно →](https://app.marketscore.ru/mcp-wordstat)**

**Сайт / Website:** https://app.marketscore.ru/mcp-wordstat

<!-- TODO(владелец): скриншот/GIF диалога с Claude сюда — главный ага-момент -->

---

## Что это

`marketscore-wordstat-mcp` — тонкий коннектор к хостовому MCP-серверу подбора слов. Сам сервер, доступ к API Яндекс Вордстата и вся логика работают на стороне сервиса — этот пакет лишь подключает к нему ваш ИИ-ассистент.

Как выглядит работа:

> **Вы:** Собери семантику по «увлажнитель воздуха», регион Москва.
>
> **Claude:** Основной запрос — 74 200 показов/мес. Похожих фраз: 40. Отсеял мусор (инфо-запросы «как выбрать», «своими руками», вакансии) — адресуемый спрос 58 900. Сезонный пик — октябрь–февраль, летом спад в ~2 раза. Топ по частотности: «увлажнитель воздуха купить» (12 100), «увлажнитель воздуха для квартиры» (8 300)…

## Что умеет

Два инструмента поверх официального API Яндекс Вордстата:

- **`wordstat_suggest`** — частотности и похожие фразы по запросу, с разметкой шума (инфо-запросы, «бесплатно/скачать», вакансии, гео-хвосты) и **адресуемым спросом** (сумма частотностей без мусора). Регион — по id геобазы (225 — Россия, 213 — Москва, 2 — Санкт-Петербург).
- **`wordstat_dynamics`** — помесячная динамика спроса за **последние 24 месяца**: когда сезонный пик и спад, растёт ниша или падает (тренд год-к-году).

Повторный запрос той же фразы отдаётся из кэша — бесплатно, без списания.

## Установка

### Claude (Desktop, веб, Code) и ChatGPT — по ссылке

Добавьте удалённый MCP-коннектор:

```
https://app.marketscore.ru/api/mcp
```

Ассистент откроет вход — авторизуйтесь по OAuth. Больше ничего вводить не нужно.

### Локальные MCP-клиенты (Cursor, VS Code, Cline, Zed) — через мост

```bash
npx -y marketscore-wordstat-mcp
```

Пример конфигурации MCP-клиента:

```json
{
  "mcpServers": {
    "wordstat": {
      "command": "npx",
      "args": ["-y", "marketscore-wordstat-mcp"]
    }
  }
}
```

## Сколько стоит

Никакой подписки — **предоплата пакетами запросов**. Один вызов `wordstat_suggest` или `wordstat_dynamics` = 1 запрос (повтор из кэша не тратит). На регистрации — **1 запрос бесплатно**, чтобы попробовать.

| Пакет | Цена | Цена за запрос |
|---|---|---|
| 100 запросов | 20 ₽ | 0.20 ₽ |
| 500 запросов | 90 ₽ | 0.18 ₽ |
| 1 000 запросов | 150 ₽ | 0.15 ₽ |
| 2 000 запросов | 250 ₽ | 0.125 ₽ |

Кредиты **не сгорают**. Без баланса сервер отдаёт 0 инструментов. Регистрация и пакеты: https://app.marketscore.ru/mcp-wordstat

## Чем отличается от парсеров Вордстата

| | Wordstat MCP (этот коннектор) | Парсеры / расширения |
|---|---|---|
| Где работает | прямо в Claude/ChatGPT, в диалоге | отдельная программа/сайт |
| Разметка шума и адресуемый спрос | есть (инфо-запросы, вакансии, гео) | обычно нет — сырая выдача |
| Сезонность | 24 месяца, пик/спад, тренд | не всегда |
| Установка | OAuth-вход по ссылке | ключ/логин, настройка |
| Оплата | предоплата, от 20 ₽, кредиты не сгорают | подписка/лимиты |

## Безопасность и доступ

- Авторизация — **OAuth 2.1**: ключи и токены не лежат в конфиге MCP-клиента, они на стороне сервиса.
- Смена пароля аккаунта отзывает все выданные MCP-доступы.
- Персональные данные хранятся на серверах в РФ (152-ФЗ).
- Без действующего баланса запросов сервер отдаёт **0 инструментов** — коннектор бесполезен без пополнения.

## FAQ

**Это бесплатно?** Первый запрос — да (демо на регистрации). Дальше — пакеты от 20 ₽.

**Нужна ли подписка?** Нет. Это разовая предоплата пакетами, кредиты не сгорают.

**Работает ли с ChatGPT, Cursor, VS Code?** Да: Claude и ChatGPT подключаются по URL напрямую, Cursor/VS Code/Cline/Zed — через этот пакет (`npx -y marketscore-wordstat-mcp`).

**Чем данные отличаются от бесплатного wordstat.yandex.ru?** Источник тот же (официальный API Яндекса), но ответ приходит уже размеченным: мусор отделён, посчитан адресуемый спрос, сезонность за 2 года — всё в одном ответе внутри чата.

**Нужен ли аккаунт Яндекс Директа?** Нет. Wordstat MCP — самостоятельный продукт для подбора слов, кабинет Директа не требуется.

## Docker

```bash
docker build -t marketscore-wordstat-mcp .
docker run -i --rm -v ~/.mcp-auth:/root/.mcp-auth marketscore-wordstat-mcp
```

OAuth-URL печатается в stdout — браузер из контейнера не откроется, перейдите по ссылке вручную. Токены `mcp-remote` живут в `~/.mcp-auth` — смонтируйте volume, чтобы не переавторизовываться при каждом запуске.

## Полезные ссылки

- Wordstat в Claude и ChatGPT: https://app.marketscore.ru/blog/wordstat-v-claude-i-chatgpt
- Как ИИ чистит семантику: https://app.marketscore.ru/blog/kak-ii-chistit-semantiku

---

## English

**Wordstat MCP** is a hosted MCP service for **Yandex Wordstat** (Russian keyword research). This package is a thin connector to the hosted server: it lets **Claude**, **ChatGPT**, or any MCP client pull keyword frequencies, related phrases (with noise filtering and addressable-demand totals), and 24-month seasonality straight from chat.

**Install (remote, Claude/ChatGPT):** add connector URL `https://app.marketscore.ru/api/mcp` and sign in via OAuth.

**Install (local MCP clients — Cursor, VS Code, Cline, Zed):**

```json
{
  "mcpServers": {
    "wordstat": {
      "command": "npx",
      "args": ["-y", "marketscore-wordstat-mcp"]
    }
  }
}
```

**Tools:** two tools over the official Yandex Wordstat API — `wordstat_suggest` (frequencies + related phrases with noise annotation and addressable demand) and `wordstat_dynamics` (24-month demand seasonality: peak/trough, year-over-year trend). Repeat lookups are served from cache for free.

**Pricing:** no subscription — prepaid request packs. Sign-up includes 1 free request. 100 req — 20 ₽; 500 — 90 ₽; 1 000 — 150 ₽; 2 000 — 250 ₽. Credits never expire. Without a balance the server exposes zero tools. No Yandex Direct account required.

**FAQ:**

**Is it free?** The first request is (a demo on sign-up); after that, packs from 20 ₽.

**Where do my credentials go?** OAuth 2.1 — nothing is stored in the local MCP client config; auth lives on the service. Personal data is stored on servers in Russia (152-FZ).

**Works with ChatGPT, Cursor, VS Code?** Yes — Claude and ChatGPT connect by URL directly; Cursor/VS Code/Cline/Zed via `npx -y marketscore-wordstat-mcp`.

Keywords: Yandex Wordstat, Яндекс Вордстат, keyword research, семантика, подбор слов, MCP, Model Context Protocol, MCP server, SEO, PPC, search demand, seasonality, Claude, ChatGPT, Cursor, AI marketing.

## License

MIT — see [LICENSE](./LICENSE). Коннектор открыт; сервис подбора слов — платный. / The connector is open; the keyword-research service is paid.
