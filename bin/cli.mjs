#!/usr/bin/env node
/**
 * Тонкий коннектор к хостовому MCP-серверу подбора слов (Яндекс Вордстат).
 * Всё, что он делает — поднимает мост `mcp-remote` к https://app.marketscore.ru/api/mcp.
 * Сервер сам определяет wordstat-доступ по предоплаченному балансу запросов и
 * отдаёт только инструменты подбора слов. Логика и доступ к API — на стороне сервиса.
 *
 * Использование:
 *   npx -y marketscore-wordstat-mcp
 * Переопределить адрес (для разработки): MARKETSCORE_MCP_URL=... npx -y marketscore-wordstat-mcp
 */
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const url = process.env.MARKETSCORE_MCP_URL || "https://app.marketscore.ru/api/mcp";
const args = process.argv.slice(2);

if (args.includes("--version") || args.includes("-v")) {
  const require = createRequire(import.meta.url);
  const pkg = require("../package.json");
  console.log(pkg.version);
  process.exit(0);
}

if (args.includes("--help") || args.includes("-h")) {
  console.log(`marketscore-wordstat-mcp — MCP-коннектор для подбора слов (Яндекс Вордстат)

Тонкий мост (через mcp-remote) к хостовому MCP-серверу marketscore.ru:
  ${url}

Даёт в Claude/ChatGPT два инструмента:
  wordstat_suggest    частотности и похожие фразы + разметка шума и адресуемый спрос
  wordstat_dynamics   сезонность спроса за 24 месяца (пик/спад, тренд год-к-году)

Использование:
  npx -y marketscore-wordstat-mcp      запустить коннектор (stdio MCP)
  --version, -v                        показать версию
  --help, -h                           эта справка

Env:
  MARKETSCORE_MCP_URL                  переопределить адрес сервера

Требуется аккаунт marketscore.ru (предоплата пакетами запросов, от 20 ₽):
  https://app.marketscore.ru/mcp-wordstat`);
  process.exit(0);
}

const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const child = spawn(npx, ["-y", "mcp-remote@0", url, ...args], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

child.on("error", (err) => {
  console.error("[marketscore-wordstat-mcp] не удалось запустить mcp-remote:", err.message);
  process.exit(1);
});
child.on("exit", (code) => process.exit(code ?? 0));
