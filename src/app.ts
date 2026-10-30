import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { GroqProvider } from "./llm/groq.ts";
import { RagService } from "./rag/answer.ts";
import { BM25Retriever } from "./rag/bm25.ts";
import { loadKnowledgeBase } from "./rag/chunker.ts";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const chunks = loadKnowledgeBase(join(root, "knowledge-base"));

export const retriever = new BM25Retriever(chunks);
export const ragService = new RagService(retriever, new GroqProvider());
export const knowledgeStats = {
  documents: new Set(chunks.map((chunk) => chunk.documentId)).size,
  chunks: chunks.length
};
