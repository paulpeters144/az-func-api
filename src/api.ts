import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { IApiRequest, IApiResponse, Method } from './types';
import { IEndpointHandlerInternal } from './endpoint-handler';
import { IRouterInternal, RouteHandler } from './route-handler';
import { routeBuilder } from './builder';
import { ResponseBuilder } from './response-builder';

interface RequestParams {
   method: string;
   path: string;
   request: HttpRequest | IApiRequest;
   context?: InvocationContext;
}

export class AzFuncApi {
   routes: IRouterInternal[] = [];
   endpoints: Record<string, IEndpointHandlerInternal> = {};
   private _built = false;

   route(path: string, func: (router: IRouterInternal) => void) {
      const topLevelRoute = RouteHandler(path, func);
      this.routes.push(topLevelRoute);

      return topLevelRoute;
   }

   async handle(reqParams: RequestParams): Promise<HttpResponseInit> {
      if (!this._built) {
         this._buildRoutes();
      }

      const { method, path, request, context } = reqParams;

      const req = await this._convertToApiRequest(request, context);
      const normalizedPath = this._normalizePath(method as Method, path);

      let response: IApiResponse | null;
      for (const routePath in this.endpoints) {
         const urlParams = this._extractUrlParams(routePath, normalizedPath);
         if (urlParams) {
            req.params = urlParams;
            response = await this.endpoints[routePath].call(req);
            break;
         }
      }

      response = response ?? this._pathNotFound();

      return ResponseBuilder()
         .setStatus(response.status)
         .setBody(response.body)
         .setHeaders(response.headers)
         .setCookies(response.cookies)
         .build();
   }

   private _buildRoutes() {
      this.endpoints = routeBuilder(this.routes).build();
      this._built = true;
      this.routes = null;
   }

   private _extractUrlParams(
      template: string,
      path: string
   ): Record<string, string> | null {
      const paramNames: string[] = [];
      const regexPath = template.replace(/:([^/]+)/g, (_, paramName) => {
         paramNames.push(paramName);
         return '([^/]+)';
      });

      const regex = new RegExp(`^${regexPath}$`);
      const match = path.match(regex);
      if (!match) return null;

      const params: Record<string, string> = {};
      paramNames.forEach((name, index) => {
         params[name] = match[index + 1];
      });

      return params;
   }

   private _pathNotFound(): IApiResponse {
      return {
         status: 404,
         body: {
            message: 'path not found',
         },
         headers: {
            'Content-Type': 'application/json',
         },
      };
   }

   private _normalizePath(method: Method, path: string): string {
      const base = `${method}#${path}`;
      const normalized = base.replace(/:[^\s/]+/g, '([^/]+)');
      return normalized;
   }

   private async _convertToApiRequest(
      req: HttpRequest | IApiRequest,
      ctx?: InvocationContext
   ): Promise<IApiRequest> {
      if (req instanceof HttpRequest) {
         const body = req.body ? await req.json() : null;
         return {
            body,
            method: req.method,
            url: req.url,
            headers: req.headers,
            query: req.query,
            params: req.params,
            context: ctx,
            arrayBuffer: req.arrayBuffer,
            blob: req.blob,
            formData: req.formData,
            text: req.text,
         };
      }

      return req;
   }
}
