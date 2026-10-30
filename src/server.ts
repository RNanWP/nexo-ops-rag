import { createServer } from "node:http";
import { knowledgeStats, ragService, retriever } from "./app.ts";

const port = Number(process.env.PORT ?? 3333);
const allowedOrigin = process.env.ALLOWED_ORIGIN ?? "http://localhost:3000";

function writeJson(
  response: import("node:http").ServerResponse,
  status: number,
  value: unknown
) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": allowedOrigin,
    Vary: "Origin"
  });
  response.end(JSON.stringify(value));
}

async function readJson(request: import("node:http").IncomingMessage) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 32_000) throw new Error("request_too_large");
  }
  return JSON.parse(body || "{}") as Record<string, unknown>;
}

const server = createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      Vary: "Origin"
    });
    response.end();
    return;
  }

  if (request.method === "GET" && request.url === "/health") {
    writeJson(response, 200, { ok: true, knowledgeBase: knowledgeStats });
    return;
  }

  if (request.method === "POST" && request.url === "/ask") {
    try {
      const body = await readJson(request);
      if (typeof body.question !== "string") {
        writeJson(response, 400, { error: "question_must_be_a_string" });
        return;
      }
      writeJson(response, 200, await ragService.answer(body.question));
    } catch (error) {
      writeJson(response, 500, {
        error: error instanceof Error ? error.message : "internal_error"
      });
    }
    return;
  }

  if (request.method === "POST" && request.url === "/search") {
    try {
      const body = await readJson(request);
      if (typeof body.question !== "string") {
        writeJson(response, 400, { error: "question_must_be_a_string" });
        return;
      }
      writeJson(
        response,
        200,
        retriever.search(body.question, 5).map((item) => ({
          ...item,
          score: Number(item.score.toFixed(4))
        }))
      );
    } catch (error) {
      writeJson(response, 500, {
        error: error instanceof Error ? error.message : "internal_error"
      });
    }
    return;
  }

  writeJson(response, 404, { error: "not_found" });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`NexoOps API em http://localhost:${port}`);
});
