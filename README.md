# az-func-api

## API Framework for Azure Functions

`az-func-api` is a lightweight and flexible API framework designed to simplify the development of serverless applications on Azure Functions. It provides an easy-to-use routing system, middleware support, and hooks for pre- and post-processing requests.

## Features

-  Simple routing for endpoints
-  Middleware support with pre- and post-hook processing
-  Create full featured APIs in an Azure Function
-  Typescript support for safety

## Installation

You can install az-func-api via npm:

```bash
npm install az-func-api
```

## Usage

#### Hello World Example

```typescript
import AzFuncApi, { IRouter, IApiRequest } from 'az-func-api';

const azApi = new AzFuncApi();

// GET /api/v1/get/endpoint
azApi.route('/api/v1', (router: IRouter) => {
   router.get('/get/endpoint', (req: IApiRequest) => {
      return { body: { message: 'Hello, World!' } };
   });
});

azApi.buildRoutes();
```

#### Example with Pre & Post Hooks

```typescript
const azApi = new AzFuncApi();

// POST /top-route/sub-route/post/echo
azApi
   .route('/top-route', (router: IRouter) => {
      router
         .route('/sub-route', (router: IRouter) => {
            router
               .post('/post/echo', (req: IApiRequest) => {
                  return { status: 200, body: { id: req.body } };
               })
               .addPreHook(log('1').preroute)
               .addPostHook(log('1').postroute);
         })
         .addPreHook(log('2').preroute)
         .addPostHook(log('2').postroute);
   })
   .addPreHook(log('3').preroute)
   .addPostHook(log('3').postroute);

azApi.buildRoutes();

const log = (msg: string) => {
   const preroute = (req: IApiRequest) => {
      console.log('PRE-HOOK: ' + msg);
      // Returning null allows the request to proceed to the endpoint
      // Or return an IApiResponse to protect the route/endpoint
      // PreRouteHooks can be useful for json validation or authorization
      return null;
   };

   const postroute = (req: IApiRequest, res: IApiResponse) => {
      // Modify the response post endpoint or post route.
      // Can be useful for creating route defined CORS policies or
      // sanitizing responses before being sent to callers.
      console.log('POST-HOOK: ' + msg);
   };

   return { preroute, postroute };
};

// PRE-HOOK: 1
// PRE-HOOK: 2
// PRE-HOOK: 3
//  --POST-ENDPOINT--
// POST-HOOK: 1
// POST-HOOK: 2
// POST-HOOK: 3
```

## License

Copyright 2024 Paul Peters

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
