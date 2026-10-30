import type { LLMProvider } from "./provider.ts";

type GroqResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

export class GroqProvider implements LLMProvider {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly baseUrl: string;

  constructor(options?: { apiKey?: string; model?: string; baseUrl?: string }) {
    this.apiKey = options?.apiKey ?? process.env.GROQ_API_KEY ?? "";
    this.model =
      options?.model ?? process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
    this.baseUrl =
      options?.baseUrl ??
      process.env.GROQ_BASE_URL ??
      "https://api.groq.com/openai/v1";
  }

  async generate(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error(
        "GROQ_API_KEY nao configurada. Copie .env.example para .env e adicione a chave."
      );
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: this.model,
        temperature: 0.1,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Voce responde em portugues brasileiro e segue estritamente o contexto fornecido."
          },
          { role: "user", content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`Groq respondeu HTTP ${response.status}: ${body.slice(0, 300)}`);
    }

    const data = (await response.json()) as GroqResponse;
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("O provedor retornou uma resposta vazia.");
    return content;
  }
}
