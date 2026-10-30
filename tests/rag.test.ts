import assert from "node:assert/strict";
import test from "node:test";
import type { Chunk } from "../src/domain/types.ts";
import type { LLMProvider } from "../src/llm/provider.ts";
import { RagService } from "../src/rag/answer.ts";
import { BM25Retriever } from "../src/rag/bm25.ts";

const chunks: Chunk[] = [
  {
    id: "seguranca#0",
    documentId: "seguranca",
    source: "seguranca.md",
    title: "Interrupcao obrigatoria",
    content: "Interrompa a operacao diante de carga instavel e acione a lideranca."
  }
];

class FakeProvider implements LLMProvider {
  calls = 0;
  private readonly output: string;

  constructor(output: string) {
    this.output = output;
  }

  async generate(): Promise<string> {
    this.calls += 1;
    return this.output;
  }
}

test("retorna resposta com citacao validada", async () => {
  const provider = new FakeProvider(
    JSON.stringify({
      answer: "Interrompa a operacao e acione a lideranca.",
      citationIds: ["seguranca#0"],
      needsHumanReview: true,
      reason: "safety_incident"
    })
  );
  const service = new RagService(new BM25Retriever(chunks), provider);
  const result = await service.answer("Ha uma carga instavel na operacao");

  assert.equal(result.citations[0].chunkId, "seguranca#0");
  assert.equal(result.needsHumanReview, true);
  assert.equal(provider.calls, 1);
});

test("descarta citacao inventada pelo modelo", async () => {
  const provider = new FakeProvider(
    JSON.stringify({
      answer: "Continue normalmente.",
      citationIds: ["documento-inexistente#9"],
      needsHumanReview: false,
      reason: null
    })
  );
  const service = new RagService(new BM25Retriever(chunks), provider);
  const result = await service.answer("Ha uma carga instavel na operacao");

  assert.deepEqual(result.citations, []);
  assert.equal(result.needsHumanReview, true);
  assert.equal(result.reason, "missing_valid_citation");
});

test("recusa sem chamar o modelo quando nao encontra evidencia", async () => {
  const provider = new FakeProvider("{}");
  const service = new RagService(new BM25Retriever(chunks), provider);
  const result = await service.answer("Como configurar um satelite orbital?");

  assert.equal(result.needsHumanReview, true);
  assert.equal(result.reason, "no_retrieval_evidence");
  assert.equal(provider.calls, 0);
});

test("marca saida invalida do modelo para revisao", async () => {
  const provider = new FakeProvider("nao e json");
  const service = new RagService(new BM25Retriever(chunks), provider);
  const result = await service.answer("Ha uma carga instavel na operacao");

  assert.equal(result.needsHumanReview, true);
  assert.equal(result.reason, "invalid_model_output");
});
