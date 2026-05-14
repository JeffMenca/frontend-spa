# Code 'n Bugs — Congress Management

Multi-tenant web platform for institutions to organize congresses: participants, work proposals, scientific committee evaluation, attendance, diplomas, and wallet-based payments with configurable commission.

## Repository Topology

| Repository                    | Purpose               | Port |
| ----------------------------- | --------------------- | ---- |
| `project-frontend-spa` (this) | Next.js 15 SPA + BFF  | 3000 |
| `project-iam-service`         | Identity, auth, roles | 8081 |
| `project-conference-service`  | Domain core           | 8082 |
| `project-wallet-service`      | Wallet and payments   | 8083 |

## Stack

Next.js 15 (App Router) · Tailwind CSS v4 · shadcn/ui · lucide-react · zod · react-hook-form · Vitest · Playwright · Spring Boot · Lombok · OpenAPI 3.0 · JaCoCo · PostgreSQL · JWT · AWS · GitHub Actions.

## Quickstart — Frontend (this repo)

```bash
npm install
npm run dev
```

## Quickstart — Backend (per service)

```bash
./mvnw spring-boot:run
```
