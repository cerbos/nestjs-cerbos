# Cerbos NestJS Demo

This demo shows how to use [Cerbos](https://cerbos.dev) from a [NestJS](https://nestjs.com/) application. A NestJS interceptor asks the Cerbos policy decision point (PDP) whether the current principal may `view` the document a controller is about to return, and rejects the request when the policy says no.

## Table of contents

- [Overview](#overview)
- [Requirements](#requirements)
- [Run the example](#run-the-example)
- [Try it out](#try-it-out)
- [How it works](#how-it-works)
- [Change the policies](#change-the-policies)
- [Commands](#commands)
- [Learn more](#learn-more)

## Overview

**[Cerbos](https://cerbos.dev)** is an open-source authorization layer for decoupled access control. Policies are written in a human-readable YAML format and evaluated by the Cerbos PDP, so your application code only has to ask "can this principal do this action on this resource?".

Cerbos works with any identity provider (Auth0, Okta, FusionAuth, Clerk, WorkOS, or your own directory), because it only needs the principal's ID, roles and attributes.

The policy for this demo lives in `cerbos/policies/documents.yaml` and governs access to a `document` resource:

- anyone with the `admin` role can view any document
- anyone with the `user` role can view documents they authored

### Tech stack

- [Cerbos](https://cerbos.dev) via the [`@cerbos/grpc`](https://www.npmjs.com/package/@cerbos/grpc) client
- [NestJS](https://nestjs.com/) 12
- [RxJS](https://rxjs.dev/)

## Requirements

- Node.js 22.12 or newer (see `.nvmrc`)
- Docker, to run the Cerbos PDP locally

## Run the example

```bash
git clone https://github.com/cerbos/nestjs-cerbos.git
cd nestjs-cerbos
npm install
```

Start the Cerbos PDP with the policies from this repository, then start the NestJS app in watch mode:

```bash
npm run start:devcerbos
```

This is equivalent to running `npm run cerbos:start` followed by `npm run start:dev`. The API listens on <http://localhost:3000> and talks to Cerbos on `127.0.0.1:3593`.

The app reads two optional environment variables:

| Variable         | Default          | Description                                   |
| ---------------- | ---------------- | --------------------------------------------- |
| `CERBOS_ADDRESS` | `127.0.0.1:3593` | Host and port of the Cerbos PDP gRPC endpoint |
| `CERBOS_TLS`     | `false`          | Set to `true` when the PDP is served over TLS |
| `PORT`           | `3000`           | Port the NestJS application listens on        |

## Try it out

Send a `GET` request to `http://localhost:3000/document/:id` with an `authorization` header of either `user` or `admin`. Any other value (or no header) is treated as an anonymous principal.

```bash
curl -i -H 'authorization: admin' http://localhost:3000/document/1
curl -i -H 'authorization: user'  http://localhost:3000/document/2
curl -i -H 'authorization: user'  http://localhost:3000/document/1   # 403
```

Three documents are defined in `src/db.ts`:

| Document      | Author                 | `admin` | `user` |
| ------------- | ---------------------- | ------- | ------ |
| `/document/1` | `admin`                | 200     | 403    |
| `/document/2` | `user`                 | 200     | 200    |
| `/document/3` | `not-the-current-user` | 200     | 403    |

Requesting a document that does not exist returns `404`.

> **Note:** the `authorization` header is used as-is to build the principal purely to keep the demo small. Do not do this in a real application; derive the principal from a proper authentication guard (for example a JWT guard).

## How it works

- `src/cerbos/cerbos.module.ts` creates a single `@cerbos/grpc` client and makes it injectable.
- `src/document/document.cerbos.interceptor.ts` runs after the controller. It builds a principal from the request, calls `cerbos.isAllowed(...)` with the document as the resource, and throws `ForbiddenException` when access is denied.
- `src/document/document.controller.ts` applies the interceptor with `@UseInterceptors(CerbosInterceptor)` and returns the document from the fake database in `src/db.ts`.

## Change the policies

The Cerbos container mounts `./cerbos` and watches for changes, so you can edit `cerbos/policies/documents.yaml` while the demo is running. The end-to-end tests in `test/` exercise every combination in the table above and are a convenient way to check a policy change:

```bash
npm run cerbos:start
npm run test:e2e
npm run cerbos:stop
```

## Commands

| Command                   | Description                                                   |
| ------------------------- | ------------------------------------------------------------- |
| `npm run cerbos:start`    | Start the Cerbos PDP in Docker with the policies in `cerbos/` |
| `npm run cerbos:stop`     | Stop the Cerbos container                                     |
| `npm run start:dev`       | Start the NestJS application in watch mode                    |
| `npm run start:devcerbos` | Start Cerbos and the application together                     |
| `npm run build`           | Compile to `dist/`                                            |
| `npm run start:prod`      | Run the compiled application                                  |
| `npm test`                | Run the unit tests (no Cerbos needed)                         |
| `npm run test:e2e`        | Run the end-to-end tests against a running Cerbos PDP         |
| `npm run lint`            | Lint with oxlint                                              |
| `npm run format`          | Format with Prettier                                          |

## Learn more

- [Cerbos website](https://cerbos.dev)
- [Cerbos documentation](https://docs.cerbos.dev)
- [Cerbos policy reference](https://docs.cerbos.dev/cerbos/latest/policies)
- [NestJS documentation](https://docs.nestjs.com/)
