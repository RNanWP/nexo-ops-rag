export type Chunk = {
  id: string;
  documentId: string;
  source: string;
  title: string;
  content: string;
};

export type SearchResult = Chunk & {
  score: number;
};

export type EvaluationCase = {
  id: string;
  question: string;
  relevantDocumentIds: string[];
  notes?: string;
};

export type CaseResult = {
  id: string;
  question: string;
  relevantDocumentIds: string[];
  retrievedDocumentIds: string[];
  reciprocalRank: number;
  hit: number;
  recall: number;
};

export type Citation = {
  chunkId: string;
  documentId: string;
  title: string;
  source: string;
  excerpt: string;
  score: number;
};

export type RagAnswer = {
  question: string;
  answer: string;
  citations: Citation[];
  needsHumanReview: boolean;
  reason: string | null;
};
