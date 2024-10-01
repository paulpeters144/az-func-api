# az-func-api

## API Framework for Azure Functions

`az-func-api` is a lightweight and flexible API framework designed to simplify the development of serverless applications on Azure Functions. It provides an easy-to-use routing system, middleware support, and hooks for pre- and post-processing requests.

## Features

- Simple routing for endpoints
- Middleware support for pre- and post-processing
- Built-in logging hooks
- TypeScript support for type safety

## Installation

You can install az-func-api via npm:

```bash
npm install az-func-api
```

## Usage

Here's a quick example to get you started:

```typescript
import { AzFuncApi } from "az-func-api";

const azApi = new AzFuncApi();

azApi.route("/example", (router) => {
  router.get("/", (req) => {
    return { status: 200, body: { message: "Hello, world!" } };
  });
});

// more documentation to come later
```

## License

Copyright 2024 Paul Peters

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
