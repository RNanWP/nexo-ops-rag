import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { EvaluationCase } from "../domain/types.ts";
import { evaluateCase, summarize } from "../evaluation/metrics.ts";
import { BM25Retriever } from "../rag/bm25.ts";
import { loadKnowledgeBase } from "../rag/chunker.ts";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const knowledgeBase = join(root, "knowledge-base");
const datasetPath = join(root, "dataset", "evaluation.json");
const k = 3;

const chunks = loadKnowledgeBase(knowledgeBase);
const samples = JSON.parse(
  readFileSync(datasetPath, "utf8")
) as EvaluationCase[];
const retriever = new BM25Retriever(chunks);
const results = samples.map((sample) => evaluateCase(retriever, sample, k));
const summary = summarize(results);

console.log("\nNexoOps — avaliacao do recuperador BM25");
console.log(`Documentos: ${new Set(chunks.map((chunk) => chunk.documentId)).size}`);
console.log(`Trechos indexados: ${chunks.length}`);
console.log(`Perguntas: ${summary.cases}`);
console.log(`Hit@${k}: ${(summary.hitAtK * 100).toFixed(1)}%`);
console.log(`MRR@${k}: ${(summary.mrrAtK * 100).toFixed(1)}%`);
console.log(`Recall@${k}: ${(summary.recallAtK * 100).toFixed(1)}%\n`);

const failures = results.filter((result) => result.hit === 0);
if (failures.length > 0) {
  console.log("Casos sem documento relevante no top-k:");
  for (const failure of failures) {
    console.log(`- ${failure.id}: ${failure.question}`);
    console.log(`  esperado: ${failure.relevantDocumentIds.join(", ")}`);
    console.log(`  retornado: ${failure.retrievedDocumentIds.join(", ") || "nenhum"}`);
  }
}
