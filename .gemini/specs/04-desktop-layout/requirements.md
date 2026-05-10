# Feature 04 — Desktop Layout: Requirements

**Status:** Aprovado

## User Stories

**US-10 · Ver Dashboard e Locais simultaneamente no desktop**
> Como usuário em desktop, quero ver a tábua de marés e a lista de
> localidades ao mesmo tempo, sem alternar entre telas.

**US-11 · Layout mobile inalterado**
> Como usuário mobile, quero que nada mude na experiência atual.

## Critérios de Aceite

| ID | Critério | Prioridade |
|----|----------|------------|
| AC-01 | Em lg+ (≥1024px): dois painéis lado a lado | Must |
| AC-02 | Painel esquerdo: Dashboard, largura fixa ~420px | Must |
| AC-03 | Painel direito: Locais, ocupa espaço restante | Must |
| AC-04 | BottomNav oculto em desktop | Must |
| AC-05 | Cada painel tem scroll independente | Must |
| AC-06 | Selecionar localidade no painel direito atualiza o esquerdo | Must |
| AC-07 | Em mobile (<1024px): comportamento atual inalterado | Must |
| AC-08 | Sem flash de layout ao carregar | Should |
