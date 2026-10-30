# NexoOps RAG

Um assistente de IA para consultar procedimentos de logística, encontrar a orientação mais relevante e responder mostrando de onde a informação veio.

> O projeto está em desenvolvimento. A versão atual já tem busca, avaliação e um fluxo RAG funcional, mas ainda não representa um produto pronto para uso em uma operação real.

## De onde veio a ideia

A ideia do NexoOps nasceu de duas partes da minha trajetória: minha experiência trabalhando com logística e o que venho estudando em desenvolvimento de software e inteligência artificial.

Em uma operação, nem sempre basta encontrar qualquer resposta. É preciso encontrar o procedimento certo, entender o que pode ou não ser feito e saber quando o caso precisa ser encaminhado para uma pessoa responsável. Por isso, o projeto foi pensado desde o começo para trabalhar com fontes, citações e revisão humana.

## O que já está funcionando

- leitura de procedimentos em Markdown;
- divisão dos documentos em trechos menores;
- busca lexical com BM25;
- geração de respostas com LLM usando os trechos recuperados;
- citações ligadas aos documentos da base;
- bloqueio de citações inventadas pelo modelo;
- recusa quando não existe evidência suficiente;
- API HTTP para busca e perguntas;
- dataset de avaliação versionado;
- testes automatizados e CI com GitHub Actions.

## Como funciona

1. Os procedimentos são carregados e divididos por seção.
2. A pergunta do usuário passa pelo recuperador BM25.
3. Os trechos mais relevantes são enviados ao modelo como contexto.
4. O modelo responde em um formato estruturado e informa quais trechos usou.
5. O servidor valida as citações antes de entregar a resposta.
6. Casos sem evidência, com saída inválida ou risco operacional são marcados para revisão humana.

A arquitetura e as decisões estão detalhadas em [docs/architecture.md](docs/architecture.md).

## Avaliação atual

A primeira baseline usa 6 procedimentos, 24 trechos e 12 perguntas anotadas.

| Recuperador | Hit@3 | MRR@3 | Recall@3 |
| --- | ---: | ---: | ---: |
| BM25 | 91,7% | 87,5% | 87,5% |

Uma das perguntas usa a palavra “fotos”, enquanto o documento correspondente usa “fotografias”. O BM25 não encontrou o documento correto no top 3. Mantive essa falha no dataset porque ela será útil para medir se embeddings e busca híbrida realmente melhoram o sistema.

O protocolo completo está em [docs/evaluation.md](docs/evaluation.md).

## Estado do produto

| Entrega | Estado |
| --- | --- |
| Ingestão de Markdown | Implementada |
| RAG com citações | Implementado |
| Recusa sem evidência | Implementada e testada |
| API | Implementada |
| Testes e CI | Implementados |
| Embeddings e busca híbrida | Próxima etapa |
| Classificação de incidentes | Pendente |
| Interface web | Pendente |
| Webhook e n8n | Pendente |
| Docker e deploy público | Pendente |
| Teste com usuários | Pendente |

O acompanhamento detalhado está em [docs/status.md](docs/status.md).

## Executando localmente

Requer Node.js 22.6 ou superior.

```bash
npm test
npm run evaluate
```

Os testes e a avaliação da recuperação não precisam de chave de API.

Para testar a resposta gerada pelo modelo:

```bash
cp .env.example .env
# adicione a sua GROQ_API_KEY no arquivo .env
npm run ask -- "O saldo físico está diferente do sistema. O que devo fazer?"
```

Para iniciar a API:

```bash
npm start
```

```bash
curl -X POST http://localhost:3333/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"Encontrei um produto avariado. Como devo registrar?"}'
```

## Próximas etapas

1. revisar os procedimentos com experiência real de operação, sem dados confidenciais;
2. adicionar embeddings e comparar busca lexical, vetorial e híbrida;
3. criar a classificação de incidentes e níveis de severidade;
4. desenvolver a interface web;
5. integrar webhook para revisão humana;
6. medir fidelidade, alucinação, latência e custo;
7. criar a imagem Docker e publicar a aplicação;
8. realizar um pequeno teste com usuários e documentar os resultados.

## Uso responsável

Os procedimentos deste repositório são exemplos genéricos e autorais. Eles não substituem normas internas, treinamento, orientação de segurança ou a decisão de uma pessoa responsável pela operação.

Nenhum documento de empresa, nome de sistema interno, meta, cliente ou informação confidencial deve ser adicionado à base pública.

## Licença

MIT.
