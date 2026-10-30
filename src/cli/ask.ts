import { ragService } from "../app.ts";

const question = process.argv.slice(2).join(" ").trim();
if (!question) {
  console.error('Uso: npm run ask -- "sua pergunta operacional"');
  process.exit(1);
}

try {
  const answer = await ragService.answer(question);
  console.log(JSON.stringify(answer, null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
