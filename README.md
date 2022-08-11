# Cerbos NestJS Demo

This demo project demonstrates how to use Cerbos in NestJS as an interceptor to validate requests based on policies defined in Cerbos.

## Run the project
To run the project, check `package.json` for prebuilt run configurations, by default `NestJS` offers `npm run start:dev` for development purposes. On top of that there also are Cerbos policies included in the repository, and to use this you can run the `npm run cerbos:start`. Both are combined into the single `npm run start:devcerbos`. 

## Demo Request
The demo includes an `Album` request, you can do a `GET` on `http://localhost:3000/album/1`. 

Provide the `authorization` header with either `user` as a value for getting a successful response, or anything else to get a rejected response. The success state depends on the `owner` of the `album/1` response which has the owner set to `user`. The Cerbos policy is validated in `src/album/album.cerbos.interceptor.ts` file. 

The response is of course currently hardcoded in the `/src/album/album.controller.ts` file, as this is for demonstration purposes.

> Note! You should NOT use authentication as demonstrated, we recommend using a JWT Guard in NestJS