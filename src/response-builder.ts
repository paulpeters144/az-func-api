import { HttpResponseInit } from '@azure/functions';
import { IApiResponse, IApiCookie } from '.';

export const ResponseBuilder = () => {
   const response: IApiResponse = {
      status: 200,
      enableContentNegotiation: false,
   };

   const self = {
      setStatus: (status?: number) => {
         response.status = status ?? 200;
         return self;
      },

      setBody: (body: unknown) => {
         if (body && typeof body === 'object' && !Array.isArray(body)) {
            response.body = JSON.stringify(body);
            self.setHeaders({ 'Content-Type': 'application/json' });
         } else {
            response.body = body;
         }
         return self;
      },

      setHeaders: (headers?: HeadersInit) => {
         if (headers) {
            response.headers = {
               ...response.headers,
               ...headers,
            };
         }

         return self;
      },

      setCookies: (cookies?: IApiCookie[]) => {
         response.cookies = cookies ?? [];
         return self;
      },

      enableContentNegotiation: () => {
         response.enableContentNegotiation = true;
         return self;
      },

      build: (): HttpResponseInit => {
         return response as HttpResponseInit;
      },
   };

   return self;
};
