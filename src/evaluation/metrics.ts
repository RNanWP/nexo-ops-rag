import type {
  BM25Retriever
} from "../rag/bm25.ts";
import type {
  CaseResult,
  EvaluationCase
} from "../domain/types.ts";

export function evaluateCase(
  retriever: BM25Retriever,
  sample: EvaluationCase,
  k = 3
): CaseResult {
  const results = retriever.search(sample.question, k);
  const retrievedDocumentIds = [
    ...new Set(results.map((result) => result.documentId))
  ];
  const relevant = new Set(sample.relevantDocumentIds);
  const firstRelevantIndex = retrievedDocumentIds.findIndex((id) =>
    relevant.has(id)
  );
  const foundRelevant = retrievedDocumentIds.filter((id) => relevant.has(id));

  return {
    id: sample.id,
    question: sample.question,
    relevantDocumentIds: sample.relevantDocumentIds,
    retrievedDocumentIds,
    reciprocalRank: firstRelevantIndex >= 0 ? 1 / (firstRelevantIndex + 1) : 0,
    hit: firstRelevantIndex >= 0 ? 1 : 0,
    recall: foundRelevant.length / relevant.size
  };
}

export function summarize(results: CaseResult[]) {
  if (results.length === 0) {
    return { cases: 0, hitAtK: 0, mrrAtK: 0, recallAtK: 0 };
  }

  const average = (values: number[]) =>
    values.reduce((sum, value) => sum + value, 0) / values.length;

  return {
    cases: results.length,
    hitAtK: average(results.map((result) => result.hit)),
    mrrAtK: average(results.map((result) => result.reciprocalRank)),
    recallAtK: average(results.map((result) => result.recall))
  };
}
