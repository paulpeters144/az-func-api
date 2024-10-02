import {
   IAddPostHook as IAddPostHook,
   IAddPreHook as IAddPreHook,
   IApiRequest,
   IApiResponse,
   IPostHook,
   IPreHook,
   Method,
} from './types';
import {
   EndpointHandler,
   IEndpointHandler,
   IEndpointHandlerInternal,
} from './endpoint-handler';

export interface IRouter {
   addPreHook: IAddPreHook;
   addPostHook: IAddPostHook;
   post: (
      path: string,
      handler: (req: IApiRequest) => IApiResponse | Promise<IApiResponse>
   ) => IEndpointHandler;
   route(path: string, func: (router: IRouter) => void): IRouter;
   get: (
      path: string,
      handler: (req: IApiRequest) => IApiResponse | Promise<IApiResponse>
   ) => IEndpointHandler;
   route(path: string, func: (router: IRouter) => void): IRouter;
}

export interface IRouterInternal extends IRouter {
   path: string;
   parentRoute: IRouterInternal;
   subroutes: IRouterInternal[];
   endpoints: IEndpointHandlerInternal[];
   preHook: IPreHook[];
   postHook: IPostHook[];
}

export const RouteHandler = (
   path: string,
   func: (router: IRouter) => void,
   parentRoute: IRouterInternal = null
): IRouterInternal => {
   const _path: string = path;
   const _subroutes: IRouterInternal[] = [];
   const _endpoints: IEndpointHandlerInternal[] = [];
   const _pre: IPreHook[] = [];
   const _post: IPostHook[] = [];

   const self: IRouterInternal = {
      path: _path,
      subroutes: _subroutes,
      endpoints: _endpoints,
      parentRoute,
      preHook: _pre,
      postHook: _post,
      addPreHook: null!,
      addPostHook: null!,
      route: null!,
      post: null!,
      get: null!,
   };

   const addPreHandler: IAddPreHook = (...preHandlers) => {
      _pre.push(...preHandlers);
      return { addPostHook: addPostHandler };
   };

   const route = (path: string, func: (router: IRouter) => void) => {
      const endpointHandler = RouteHandler(path, func, self);
      _subroutes.push(endpointHandler);

      return endpointHandler;
   };

   const addPostHandler: IAddPostHook = (...postHandlers) => {
      _post.push(...postHandlers);
   };

   const post = (path: string, handler: (req: IApiRequest) => IApiResponse) => {
      const endpoint = _registerEndpoint('POST', path, handler);
      _endpoints.push(endpoint);
      return endpoint;
   };

   const get = (path: string, handler: (req: IApiRequest) => IApiResponse) => {
      const endpoint = _registerEndpoint('GET', path, handler);
      _endpoints.push(endpoint);
      return endpoint;
   };

   const _registerEndpoint = (
      method: Method,
      path: string,
      handler: (req: IApiRequest) => IApiResponse
   ) => {
      const endpointHandler = EndpointHandler(method, path, handler, self);
      return endpointHandler;
   };

   self.addPreHook = addPreHandler;
   self.addPostHook = addPostHandler;
   self.route = route;
   self.post = post;

   func({
      addPreHook: addPreHandler,
      addPostHook: addPostHandler,
      route,
      post,
      get,
   });

   return self;
};
