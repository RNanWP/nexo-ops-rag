import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import type { Chunk } from "../src/domain/types.ts";
import { BM25Retriever } from "../src/rag/bm25.ts";
import { loadKnowledgeBase } from "../src/rag/chunker.ts";
import { normalizeText, tokenize } from "../src/rag/tokenize.ts";

const chunks: Chunk[] = [
  {
    id: "inventario#0",
    documentId: "inventario",
    source: "inventario.md",
    title: "Divergencia de inventario",
    content: "Bloqueie o endereco e realize uma nova contagem do estoque."
  },
  {
    id: "avaria#0",
    documentId: "avaria",
    source: "avaria.md",
    title: "Produto avariado",
    content: "Isole a unidade danificada e registre fotografias da embalagem."
  }
];

test("normaliza acentos e caixa", () => {
  assert.equal(normalizeText("Divergência ÁGIL"), "divergencia agil");
});

test("remove palavras sem valor de busca", () => {
  assert.deepEqual(tokenize("O que fazer com o produto?"), ["fazer", "produto"]);
});

test("recupera o procedimento de inventario em primeiro lugar", () => {
  const retriever = new BM25Retriever(chunks);
  const [first] = retriever.search("Como tratar divergencia na contagem do estoque?");
  assert.equal(first.documentId, "inventario");
  assert.ok(first.score > 0);
});

test("retorna vazio para consulta sem termos indexados", () => {
  const retriever = new BM25Retriever(chunks);
  assert.deepEqual(retriever.search("xilofone orbital"), []);
});

test("nao indexa o README da base de conhecimento", () => {
  const directory = mkdtempSync(join(tmpdir(), "nexo-ops-"));
  try {
    writeFileSync(join(directory, "README.md"), "# Instrucoes\nNao indexar.");
    writeFileSync(join(directory, "procedimento.md"), "# Procedimento\nIndexar.");

    const loaded = loadKnowledgeBase(directory);
    assert.equal(loaded.length, 1);
    assert.equal(loaded[0].documentId, "procedimento");
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
