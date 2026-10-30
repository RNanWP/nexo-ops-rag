import { readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import type { Chunk } from "../domain/types.ts";

function documentIdFromPath(path: string): string {
  return basename(path, ".md");
}

export function chunkMarkdown(source: string, content: string): Chunk[] {
  const documentId = documentIdFromPath(source);
  const lines = content.split(/\r?\n/);
  const chunks: Chunk[] = [];
  let title = documentId;
  let buffer: string[] = [];
  let index = 0;

  const flush = () => {
    const text = buffer.join("\n").trim();
    if (!text) return;
    chunks.push({
      id: `${documentId}#${index++}`,
      documentId,
      source,
      title,
      content: text
    });
    buffer = [];
  };

  for (const line of lines) {
    const heading = line.match(/^#{1,3}\s+(.+)$/);
    if (heading) {
      flush();
      title = heading[1].trim();
      continue;
    }
    buffer.push(line);
  }
  flush();

  return chunks;
}

export function loadKnowledgeBase(directory: string): Chunk[] {
  return readdirSync(directory)
    .filter(
      (file) => file.endsWith(".md") && file.toLowerCase() !== "readme.md"
    )
    .sort()
    .flatMap((file) => {
      const path = join(directory, file);
      return chunkMarkdown(file, readFileSync(path, "utf8"));
    });
}
