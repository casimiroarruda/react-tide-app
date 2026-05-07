# ADR-001 — Estratégia de Autenticação: BFF Go

**Data:** 2026-05-06
**Status:** Aceito
**Decisores:** Casimiro Arruda

---

## Contexto

A Tide API usa OAuth2 Client Credentials (machine-to-machine). Para obtter um JWT é
necessário um `client_secret`. O React SPA roda no browser — qualquer credencial no bundle
é visível para qualquer usuário via DevTools ou análise de rede.

Os dados de tábua de maré são **públicos** (Marinha do Brasil). O objetivo da autenticação
não é proteger dados confidenciais, mas sim:
1. Controlar o acesso à infraestrutura (evitar abuso e scraping agressivo)
2. Manter a capacidade de revogar acesso por cliente

### Alternativas Avaliadas

| Opção | Descrição | Problema |
|---|---|---|
| A | Token no `.env` do Vite (`VITE_CLIENT_SECRET`) | Secret aparece no bundle JS. Qualquer person abre o source e extrai. Inaceitável. |
| B | SSR com Next.js ou Remix | Resolve o problema mas adiciona Node.js ao stack. O desenvolvedor já escreve Go. Overhead desnecessário. |
| C | **BFF em Go** (escolhida) | Servidor leve que mantém o secret no ambiente. Browser nunca vê o secret. |
| D | Endpoint público sem auth na Tide API | Solução mais simples, mas modifica o backend e remove controle de acesso. Possível no futuro. |

---

## Decisão

**Criar um BFF (Backend for Frontend) em Go**, implantado junto com ou próximo ao frontend.

### Por que o BFF não é "o mesmo problema"

A pergunta legítima é: se o BFF fica publicamente exposto, qual a diferença?

A diferença é **onde o secret mora**:

```
SPA direta:
  Browser → [secret_no_bundle] → API
  Qualquer pessoa com DevTools extrai o secret em 10 segundos.
  O secret fica exposto para sempre até ser rotacionado.

Com BFF:
  Browser → BFF (URL pública, sem secret) → [secret_no_env] → API
  O secret nunca sai do processo do servidor.
  Não aparece em nenhuma resposta HTTP. Não aparece no bundle.
  O BFF retorna apenas dados de maré — nunca o token.
```

O BFF ser acessível pela internet não é problema porque não expõe credencial.
A proteção contra abuso vem de rate limiting no BFF, não de autenticação do browser.

---

## Implementação

### Estrutura do BFF (Go)

```
bff/
├── main.go
├── config/
│   └── config.go         # lê CLIENT_ID e CLIENT_SECRET do ambiente
├── auth/
│   └── token.go          # obtém e renova o JWT da Tide API
│                         # cache em memória com TTL baseado na expiração do token
├── handlers/
│   ├── locations.go      # GET /locations → proxy para /api/location
│   └── tides.go          # GET /tides/{id}/{day} → proxy para /api/location/{id}/tides/{day}
└── middleware/
    ├── ratelimit.go      # rate limiting por IP (ex: 100 req/min)
    └── cors.go           # CORS restrito ao domínio do frontend
```

### Variáveis de Ambiente do BFF

```env
TIDE_API_BASE_URL=http://localhost:8080
TIDE_CLIENT_ID=<uuid>
TIDE_CLIENT_SECRET=<secret>
BFF_PORT=3001
FRONTEND_ORIGIN=https://mareviva.app   # CORS whitelist
RATE_LIMIT_RPM=100                      # requisições por minuto por IP
```

### Fluxo de Auth Interno do BFF

```
1. BFF inicializa → nenhum token em cache
2. Primeira requisição chega do browser
3. BFF detecta token ausente/expirado → chama POST /api/auth/token
4. Armazena o JWT em memória com TTL (exp do JWT - 60s de margem)
5. Usa o JWT para chamar a Tide API
6. Retorna os dados ao browser (nunca o token)
7. Próximas requisições usam o token cacheado
```

### Endpoints expostos pelo BFF

```
GET /locations?lat={f}&lon={f}    → proxy de GET /api/location?lat=&lon=
GET /locations?name={string}      → proxy de GET /api/location?name=
GET /tides/{locationId}/{day}     → proxy de GET /api/location/{id}/tides/{day}
```

O BFF **não expõe** o endpoint `/auth/token` ao browser.

---

## Consequências

**Positivas:**
- `client_secret` nunca no bundle frontend
- Rate limiting centralizado e configurável
- CORS restrito ao domínio do frontend
- Possibilidade futura de adicionar cache de dados no BFF (Redis)
- Possibilidade futura de adicionar autenticação de usuário (sessão cookie)
- Compatível com a expertise Go do desenvolvedor

**Negativas:**
- Adiciona um processo a mais para rodar em desenvolvimento (mitigado com docker-compose)
- Latência adicional de um hop (desprezível na prática, ~1ms na mesma rede)

**Próximos passos:**
- Criar o projeto BFF em `/bff` na raiz do monorepo
- Adicionar `docker-compose.yml` com api + bff + frontend
- ADR-003: Estratégia de deploy (VPS? Fly.io? Railway?)

---

## Revisão

Esta decisão deve ser revisada se:
- A Tide API passar a suportar endpoints públicos sem auth para leitura
- O volume justificar cache no BFF (ex: mesmos dados requisitados muitas vezes)
- For adicionado login de usuário (o BFF já estará no lugar para emitir cookies de sessão)
