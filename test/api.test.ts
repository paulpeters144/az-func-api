import { describe, expect, it } from 'vitest';
import AzFuncApi, { IApiRequest, IApiResponse, IRouter } from '../src';

const API_REQ = {
   method: 'POST',
   url: 'https://api.example.com/users',
   headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: 'Bearer token123',
   }),
   query: new URLSearchParams({
      sort: 'asc',
      page: '1',
   }),
   params: {
      userId: '12345',
   },
   body: {
      username: 'john_doe',
      email: 'john.doe@example.com',
      password: 'securePassword123!',
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
      role: 'user',
      isActive: true,
   },
} as unknown as IApiRequest;

describe('az-func-api', () => {
   it('should set up a route with a POST endpoint that returns a success message', async () => {
      const azApi = new AzFuncApi();

      azApi
         .route('/top-route', (router: IRouter) => {
            //
            router.route('/sub-route', (router: IRouter) => {
               //
               router
                  .get('/get/endpoint', (req: IApiRequest) => {
                     return { status: 200, body: { message: 'worked!' } };
                  })
                  .addPreHook(log('PRE for /endpoint').preroute)
                  .addPostHook(log('POST for /endpoint').postroute);
               //
               router
                  .post('/post/endpoint/:userId', (req: IApiRequest) => {
                     return { status: 200, body: { id: req.params?.userId } };
                  })
                  .addPreHook(log('PRE for /endpoint/:userId').preroute)
                  .addPostHook(log('POST for /endpoint/:userId').postroute);
               //
            });
            //
         })
         .addPreHook(log('PRE for /top-route').preroute)
         .addPostHook(log('POST for /top-route').postroute);

      azApi.buildRoutes();

      const res = await azApi.handle({
         method: 'GET',
         path: '/top-route/sub-route/get/endpoint',
         request: API_REQ,
      });

      expect(res).toBeTruthy();
   });
   it('should successfully create a new user and return the user data', async () => {
      const azApi = new AzFuncApi();

      azApi
         .route('', (router: IRouter) => {
            router
               .post('/users', (req: IApiRequest) => {
                  const newUser = req.body;
                  return {
                     status: 201,
                     body: { message: 'User created', user: newUser },
                  };
               })
               .addPreHook((req: IApiRequest) => null);
         })
         .addPreHook((req: IApiRequest) => null);

      azApi.buildRoutes();

      const res = await azApi.handle({
         method: 'POST',
         path: '/users',
         request: API_REQ,
      });

      expect(res).toBeTruthy();
   });
});

const log = (msg: string) => {
   const preroute = (req: IApiRequest) => {
      console.log('PRE-ROUTE: ' + msg);
      return null;
   };

   const postroute = (req: IApiRequest, res: IApiResponse) => {
      console.log('POST-ROUTE: ' + msg);
   };

   return { preroute, postroute };
};
