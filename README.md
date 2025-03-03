# Cerbos NestJS Demo

This demo project demonstrates how to use Cerbos in NestJS as an interceptor to validate requests based on policies defined in Cerbos.

## Run the project

To run the project, check `package.json` for prebuilt run configurations, by default `NestJS` offers `npm run start:dev` for development purposes. On top of that there also are Cerbos policies included in the repository, and to use this you can run the `npm run cerbos:start`. Both are combined into the single `npm run start:devcerbos`.

## Demo Request

The demo includes an `Document` request, you can do a `GET` on `http://localhost:3000/document/1`.

Provide the `authorization` header with either `user` or `admin` as a value for getting a successful response, or anything else to get a rejected response. The success state depends on the `author` of the `documents/*`.

There are 3 documents defined in the `src/db.ts` file,

- the `document/1` can only be accessed by the `admin` user
- the `document/2` can be accessed by `user` or `admin`
- the `document/3` is for `not-the-current-user` but can be accessed by `admin`.

The Cerbos policy is validated in `src/document/document.cerbos.interceptor.ts` file.

The response is of course currently hardcoded in the `/src/document/document.controller.ts` file, as this is for demonstration purposes.

> Note! You should NOT use authentication as demonstrated, we recommend using a JWT Guard in NestJS






# NestJs example

This demo project demonstrates how to use Cerbos in NestJS as an interceptor to validate requests based on policies defined in Cerbos.

## Table of Contents

- [NestJs example](#nestjs-example)

  - [Overview](#overview)
    - [Tech Stack](#tech-stack)
  - [How to Run the Example](#how-to-run-the-example)

    - [1. Clone the repository and install the dependencies](#1-clone-the-repository-and-install-the-dependencies)
    - [2. Run the project](#2-run-the-project)
    - [3. Check out the example implementation](#3-check-out-the-example-implementation)
    - [4. Make changes to your Cerbos Policies](#3-make-changes-to-your-cerbos-policies)

  - [Commands](#commands)
  - [Learn More](#learn-more)

## Overview

**[Cerbos](https://cerbos.dev)** is an open-source authorization-as-a-service option for allowing decoupled access control in your software. It allows writing human-readable policy definitions that serve as context-aware access control policies for your application resources.

Cerbos works with any identity provider services like Auth0, Okta, FusionAuth, Clerk, Magic, WorkOS or even your own, bespoke directory system.

Our [NestJs.js](https://nestjs.com/) application will provide an API that uses Cerbos for authorization, to decide what actions are available on which resources for a given user.

The policies is defined in the `cerbos/policies` directory. Each policy is authored in the a very human-readable format which you can learn more about at the [Cerbos Policy documentation site](https://docs.cerbos.dev/cerbos/latest/policies), and for the demo revolves around access to a `contacts` resource.

### Tech Stack

- [Cerbos](https://cerbos.dev)
- [NestJs](https://nestjs.com/) - A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
- [RxJs](https://https://rxjs.dev/) - Reactive Extensions Library for JavaScript
## How to Run the Example

### 1. Clone the repository and install the dependencies

```bash
git clone https://github.com/cerbos/nestjs-cerbos.git
```

Then `cd` into the project directory and run `npm install` to install the dependencies.

```sh
npm install 
```

_Alternatviely you could use `yarn` or `pnpm` or anything that runs `npm scripts`_

## 2. Run the project

To run the project, check `package.json` for prebuilt run configurations, by default `NestJS` offers `npm run start:dev` for development purposes. On top of that there also are Cerbos policies included in the repository, and to use this you can run the `npm run cerbos:start`. Both are combined into the single `npm run start:devcerbos`.

### 3. Check out the example implementation

The demo includes an `Document` request, you can do a `GET` on `http://localhost:3000/document/1`.

Provide the `authorization` header with either `user` or `admin` as a value for getting a successful response, or anything else to get a rejected response. The success state depends on the `author` of the `documents/*`.

There are 3 documents defined in the `src/db.ts` file,

- the `document/1` can only be accessed by the `admin` user
- the `document/2` can be accessed by `user` or `admin`
- the `document/3` is for `not-the-current-user` but can be accessed by `admin`.

The Cerbos policy is validated in `src/document/document.cerbos.interceptor.ts` file.

The response is of course currently hardcoded in the `/src/document/document.controller.ts` file, as this is for demonstration purposes.

> Note! You should NOT use authentication as demonstrated, we recommend using a JWT Guard in NestJS

## 4. Make changes to your Cerbos Policies

Your showcase is now running a local version of Cerbos, and you can easily make changes to the Policies and learn more about Cerbos and all its features. 

You can use the existing set of E2E tests to test different policies and changes to existing requirements by running `npm run test:e2e`.

## Commands

- `npm run cerbos:start` - Starts the docker instance of cerbos server.
- `npm run start` - Start the nestJs application in development mode.
- `npm run start:devcerbos` - Starts both docker and the nestjs application

## Learn More

To learn more about Clerk.dev and NestJs, take a look at the following resources:

- [Cerbos Website](https://cerbos.dev)
- [Cerbos Documentation](https://docs.cerbos.dev)
- [Nest.js Documentation](https://docs.nestjs.com/) - learn about NestJs features.

