# Тонкий коннектор подбора слов (Яндекс Вордстат): запускает мост mcp-remote к
# хостовому MCP-серверу marketscore.ru. Реальная логика и доступ к API Вордстата —
# на стороне сервиса (app.marketscore.ru), авторизация по OAuth. Контейнер лишь
# проксирует stdio↔удалённый сервер.
FROM node:20-alpine

WORKDIR /app
COPY package.json ./
COPY bin ./bin

# mcp-remote ставим заранее, чтобы не тянуть на старте (в т.ч. в офлайн-сборке).
RUN npm install -g mcp-remote@0

ENV MARKETSCORE_MCP_URL=https://app.marketscore.ru/api/mcp

ENTRYPOINT ["node", "bin/cli.mjs"]
