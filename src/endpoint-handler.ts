import { IRouterInternal } from './route-handler';
import {
   IAddPostHook,
   IAddPreHook,
   IApiRequest,
   IApiResponse,
   ICall,
   IPostHook,
   IPreHook,
   Method,
} from './types';

export interface IEndpointHandler {
   call: ICall;
   addPreHook: IAddPreHook;
   addPostHandler: IAddPostHook;
}

export interface IEndpointHandlerInternal extends IEndpointHandler {
   method: Method;
   parentRoute: IRouterInternal;
   pathTemplate: string;
}

export const EndpointHandler = (
   method: Method,
   pathTemplate: string,
   callHandler: (req: IApiRequest) => IApiResponse | Promise<IApiResponse>,
   parentRoute: IRouterInternal = null
): IEndpointHandlerInternal => {
   const _method = method;
   const _pathTemplate = pathTemplate;
   const _preEndpointHandlers: IPreHook[] = [];
   const _postEndpointHandlers: IPostHook[] = [];

   const call: ICall = async (req: IApiRequest): Promise<IApiResponse> => {
      for (const pre of _preEndpointHandlers) {
         const preRes = await pre(req);
         if (preRes) {
            return preRes;
         }
      }

      const callResult = await callHandler(req);

      for (const post of _postEndpointHandlers) {
         await post(req, callResult);
      }

      return callResult;
   };

   const addPreHandler: IAddPreHook = (...preHandlers) => {
      _preEndpointHandlers.push(...preHandlers);
      return { addPostHook: addPostHandler };
   };

   const addPostHandler: IAddPostHook = (...postHandlers) => {
      _postEndpointHandlers.push(...postHandlers);
   };

   return {
      call,
      addPreHook: addPreHandler,
      addPostHandler,
      method: _method,
      pathTemplate: _pathTemplate,
      parentRoute,
   };
};
