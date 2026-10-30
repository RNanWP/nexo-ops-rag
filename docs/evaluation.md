# Protocolo de avaliacao

## Objetivo

Medir se o recuperador encontra os procedimentos necessarios antes de permitir que um LLM gere uma resposta. Uma resposta fluente com contexto errado continua sendo uma falha.

## Dataset inicial

- 6 procedimentos operacionais genericos e autorais;
- 24 trechos indexados por secao;
- 12 perguntas com documentos relevantes anotados;
- consultas escritas com variacao de vocabulario em relacao aos documentos.

## Metricas

- **Hit@3:** proporcao de perguntas com pelo menos um documento relevante entre os tres primeiros resultados.
- **MRR@3:** recompensa sistemas que posicionam o primeiro documento relevante mais perto do topo.
- **Recall@3:** proporcao dos documentos relevantes recuperada entre os tres primeiros resultados.

## Baseline v0.1

| Recuperador | Hit@3 | MRR@3 | Recall@3 |
| --- | ---: | ---: | ---: |
| BM25 | 91,7% | 87,5% | 87,5% |

## Falha conhecida preservada

A consulta `q04` usa a palavra "fotos", enquanto o procedimento correspondente utiliza "fotografias". O BM25 nao recupera o documento relevante no top 3. Esse caso nao sera reescrito para favorecer a baseline: ele serve como teste para a proxima versao com embeddings e busca hibrida.

## Proximos experimentos

1. adicionar embeddings multilingues;
2. medir busca vetorial isolada;
3. combinar BM25 e vetorial por Reciprocal Rank Fusion;
4. avaliar fidelidade das respostas com regras deterministicas e LLM-as-judge;
5. registrar latencia e custo por pergunta;
6. revisar o dataset com uma pessoa que trabalhe em operacao logistica.
