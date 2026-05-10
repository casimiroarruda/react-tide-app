# Feature 02 — Location Search: Requirements

**Status:** Aprovado

## User Stories

**US-07 · Buscar localidade por nome**
> Como usuário, quero digitar o nome de uma cidade e ver uma lista de
> localidades para selecionar a que quero consultar.

**US-08 · Encontrar localidade mais próxima**
> Como usuário, quero um botão que detecte minha localização e mostre
> automaticamente a localidade mais próxima.

**US-09 · Trocar de localidade**
> Como usuário, quero selecionar uma localidade da lista e ver a tábua
> de marés atualizada imediatamente no Dashboard.

## Critérios de Aceite

| ID | Critério | Prioridade |
|----|----------|------------|
| AC-01 | Tab "Locais" abre a LocalesPage | Must |
| AC-02 | Campo de busca filtra locations por nome via API | Must |
| AC-03 | Resultados mostram nome da localidade | Must |
| AC-04 | Tap em uma localidade → seleciona e volta ao Dashboard | Must |
| AC-05 | Botão de geolocalização busca a mais próxima | Must |
| AC-06 | Loading durante a busca | Must |
| AC-07 | Mensagem quando nenhum resultado encontrado | Must |
| AC-08 | Localidade selecionada persiste ao navegar entre tabs | Must |
| AC-09 | Inicialização automática pela geolocalização no primeiro acesso | Should |