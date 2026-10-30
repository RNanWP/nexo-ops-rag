# Estado das entregas

Este documento evita que o projeto prometa mais do que já entrega. Um item só muda para “concluído” depois de ser implementado e verificado.

| Requisito | Estado | Evidência atual | Próximo passo |
| --- | --- | --- | --- |
| Ingerir procedimentos, manuais e FAQs | Parcial | Markdown carregado por seção | PDF, texto e metadados de tipo |
| Responder com RAG e citações | Concluído na API | `RagService` e validação de IDs | Testar com provedor real e interface |
| Classificar incidentes e sugerir ações | Parcial | A resposta recupera procedimentos | Criar taxonomia, severidade e testes |
| Recusar sem evidência | Concluído | Teste `no_retrieval_evidence` | Medir taxa de recusa no dataset ampliado |
| Acionar webhook ou n8n | Pendente | — | Definir payload e endpoint de demonstração |
| Comparar versão básica e otimizada | Parcial | Baseline BM25 medida | Adicionar vetorial e busca híbrida |
| Qualidade e recuperação | Parcial | Hit@3, MRR@3 e Recall@3 | Ampliar dataset e revisar anotações |
| Alucinação e fidelidade | Pendente | Guardrails determinísticos | Criar avaliação de groundedness |
| Latência e custo | Pendente | — | Instrumentar chamadas e gerar relatório |
| API | Concluído localmente | `/health`, `/search` e `/ask` | Autenticação e limites antes do deploy |
| Interface | Pendente | — | Construir experiência de consulta e fontes |
| Testes | Concluído para a base atual | 8 testes aprovados | Cobrir API, classificador e integração |
| Docker | Pendente | — | Criar imagem e healthcheck |
| CI | Concluído | GitHub Actions | Validar depois da publicação |
| Deploy público | Pendente | — | Publicar API e interface |
| Arquitetura | Concluído para v0.2 | `docs/architecture.md` | Atualizar a cada decisão relevante |
| Relatório de experimentos | Parcial | `docs/evaluation.md` | Adicionar comparação e gráficos |
| Vídeo curto | Pendente | — | Gravar após deploy estável |
| Artigo técnico | Pendente | — | Escrever depois dos experimentos |
