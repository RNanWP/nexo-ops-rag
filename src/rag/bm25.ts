import type { Chunk, SearchResult } from "../domain/types.ts";
import { tokenize } from "./tokenize.ts";

type IndexedChunk = {
  chunk: Chunk;
  tokens: string[];
  frequencies: Map<string, number>;
};

export class BM25Retriever {
  private readonly indexed: IndexedChunk[];
  private readonly documentFrequency = new Map<string, number>();
  private readonly averageLength: number;
  private readonly k1: number;
  private readonly b: number;

  constructor(chunks: Chunk[], k1 = 1.5, b = 0.75) {
    if (chunks.length === 0) throw new Error("A base de conhecimento esta vazia.");

    this.k1 = k1;
    this.b = b;

    this.indexed = chunks.map((chunk) => {
      const tokens = tokenize(`${chunk.title} ${chunk.content}`);
      const frequencies = new Map<string, number>();
      for (const token of tokens) {
        frequencies.set(token, (frequencies.get(token) ?? 0) + 1);
      }
      for (const token of new Set(tokens)) {
        this.documentFrequency.set(
          token,
          (this.documentFrequency.get(token) ?? 0) + 1
        );
      }
      return { chunk, tokens, frequencies };
    });

    this.averageLength =
      this.indexed.reduce((sum, item) => sum + item.tokens.length, 0) /
      this.indexed.length;
  }

  search(query: string, limit = 5): SearchResult[] {
    const terms = [...new Set(tokenize(query))];
    if (terms.length === 0) return [];

    return this.indexed
      .map(({ chunk, tokens, frequencies }) => {
        const score = terms.reduce((total, term) => {
          const tf = frequencies.get(term) ?? 0;
          if (tf === 0) return total;

          const df = this.documentFrequency.get(term) ?? 0;
          const idf = Math.log(
            1 + (this.indexed.length - df + 0.5) / (df + 0.5)
          );
          const lengthNormalization =
            tf +
            this.k1 *
              (1 - this.b + this.b * (tokens.length / this.averageLength));
          return total + idf * ((tf * (this.k1 + 1)) / lengthNormalization);
        }, 0);

        return { ...chunk, score };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
      .slice(0, limit);
  }
}
