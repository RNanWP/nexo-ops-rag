# Arquitetura

```mermaid
flowchart LR
    U[Usuario] --> API[API HTTP]
    API --> RAG[Orquestrador RAG]
    RAG --> RET[Recuperador BM25]
    RET --> KB[(Base de procedimentos)]
    RET --> RAG
    RAG --> LLM[Groq / LLM]
    LLM --> VAL[Validador de JSON e citacoes]
    VAL -->|citacoes validas| API
    VAL -->|sem evidencia ou saida invalida| H[Revisao humana]

    DS[Dataset anotado] --> EV[Avaliacao]
    RET --> EV
    EV --> M[Hit@k / MRR@k / Recall@k]
```

## Decisoes atuais

- **Baseline antes de embeddings:** permite demonstrar ganho real da busca semantica, em vez de apenas adicionar uma biblioteca.
- **Documentos por secao:** cada citacao aponta para um trecho pequeno e auditavel.
- **LLM desacoplado:** o recuperador e os testes nao dependem de chave ou rede.
- **Citacoes validadas no servidor:** IDs inventados pelo modelo sao descartados.
- **Falha segura:** ausencia de evidencia, JSON invalido ou citacao inexistente exige revisao humana.
- **CORS restrito:** a origem permitida e configurada por ambiente.

## Proxima arquitetura

A v0.3 adicionara um recuperador vetorial e uma fusao de rankings. A interface continuara dependendo do mesmo contrato `SearchResult`, permitindo comparar os recuperadores sem alterar o restante do fluxo.
