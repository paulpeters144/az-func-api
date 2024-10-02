import { InvocationContext } from '@azure/functions';
import { Headers, FormData } from 'undici';

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Represents an HTTP request in the API.
 */
export interface IApiRequest {
   /**
    * The HTTP method of the request (e.g., GET, POST).
    * @readonly
    */
   readonly method: string;

   /**
    * The full URL of the request.
    * @readonly
    */
   readonly url: string;

   /**
    * A map of HTTP headers included in the request.
    */
   headers: Headers;

   /**
    * URL query parameters in the form of `URLSearchParams`.
    * @readonly
    */
   readonly query: URLSearchParams;

   /**
    * Route parameters extracted from the URL, with keys representing parameter names.
    */
   params: Record<string, string>;

   /**
    * Optional request body data, could be any type based on the request's content type.
    */
   readonly body?: any;

   /**
    * Contains metadata and helper methods specific to this invocation
    */
   context?: InvocationContext;

   /**
    * Returns a `Promise` that resolves with the request body as an `ArrayBuffer`.
    * @returns {Promise<ArrayBuffer>}
    */
   readonly arrayBuffer: () => Promise<ArrayBuffer>;

   /**
    * Returns a `Promise` that resolves with the request body as a `Blob`.
    * @returns {Promise<Blob>}
    */
   readonly blob: () => Promise<Blob>;

   /**
    * Returns a `Promise` that resolves with the request body as `FormData`.
    * @returns {Promise<FormData>}
    */
   readonly formData: () => Promise<FormData>;

   /**
    * Returns a `Promise` that resolves with the request body as a `string`.
    * @returns {Promise<string>}
    */
   readonly text: () => Promise<string>;
}

export interface IApiResponse {
   /**
    * HTTP response body
    */
   body?: any;

   /**
    * HTTP response status code
    * @default 200
    */
   status?: number;

   /**
    * HTTP response headers
    */
   headers?: HeadersInit;

   /**
    * HTTP response cookies
    */
   cookies?: IApiCookie[];

   /**
    * Enable content negotiation of response body if true
    * If false, treat response body as raw
    * @default false
    */
   enableContentNegotiation?: boolean;
}

export interface IApiCookie {
   name: string;

   value: string;

   /**
    * Specifies allowed hosts to receive the cookie
    */
   domain?: string;

   /**
    * Specifies URL path that must exist in the requested URL
    */
   path?: string;

   /**
    * NOTE: It is generally recommended that you use maxAge over expires.
    * Sets the cookie to expire at a specific date instead of when the client closes.
    * This can be a Javascript Date or Unix time in milliseconds.
    */
   expires?: Date | number;

   /**
    * Sets the cookie to only be sent with an encrypted request
    */
   secure?: boolean;

   /**
    * Sets the cookie to be inaccessible to JavaScript's Document.cookie API
    */
   httpOnly?: boolean;

   /**
    * Can restrict the cookie to not be sent with cross-site requests
    */
   sameSite?: 'Strict' | 'Lax' | 'None' | undefined;

   /**
    * Number of seconds until the cookie expires. A zero or negative number will expire the cookie immediately.
    */
   maxAge?: number;
}

export interface ICall {
   (req: IApiRequest): IApiResponse | Promise<IApiResponse>;
}

export interface IPreHook {
   (req: IApiRequest): IApiResponse | Promise<IApiResponse> | null;
}

export interface IPostHook {
   (req: IApiRequest, res: IApiResponse): Promise<void> | void;
}

export interface IAddPreHook {
   (...pre: IPreHook[]): { addPostHook: IAddPostHook };
}

export interface IAddPostHook {
   (...post: IPostHook[]): void;
}
