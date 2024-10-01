import { IEndpointHandlerInternal } from "./endpoint-handler";
import { IRouterInternal } from "./route-handler";

export const routeBuilder = (routes: IRouterInternal[]) => {
  const build = () => {
    const collectEndpoints = (
      routes: IRouterInternal[],
      parentPath: string = "",
      endpoints: IEndpointHandlerInternal[] = []
    ): IEndpointHandlerInternal[] => {
      for (const route of routes) {
        const fullPath = joinPaths(parentPath, route.path);

        if (route.endpoints.length > 0) {
          const routeEndpoints: IEndpointHandlerInternal[] = [];

          for (const endpoint of route.endpoints) {
            const path = joinPaths(fullPath, endpoint.pathTemplate);
            const pathTemplate = `${endpoint.method.toUpperCase()}#${path}`;

            const processedEndpoint: IEndpointHandlerInternal = {
              ...endpoint,
              pathTemplate,
            };

            routeEndpoints.push(processedEndpoint);
          }
          endpoints.push(...routeEndpoints);
        }

        if (route.subroutes.length > 0) {
          collectEndpoints(route.subroutes, fullPath, endpoints);
        }
      }

      return endpoints;
    };

    const addPrePostHandlers = (endpoints: IEndpointHandlerInternal[]) => {
      for (const endpoint of endpoints) {
        let currentRoute = endpoint.parentRoute;
        while (currentRoute) {
          endpoint.addPreHook(...currentRoute.preHandlers);
          endpoint.addPostHandler(...currentRoute.postHandlers);
          currentRoute = currentRoute.parentRoute;
        }
      }
    };

    const joinPaths = (...paths: string[]): string => {
      return (
        "/" +
        paths
          .map((p) => p.replace(/^\/|\/$/g, ""))
          .filter(Boolean)
          .join("/")
      );
    };

    const endpoints = collectEndpoints(routes);
    addPrePostHandlers(endpoints);

    const result: Record<string, IEndpointHandlerInternal> = {};

    for (const ep of endpoints) {
      if (endpoints[ep.pathTemplate]) {
        const msg = "Route already exists: ";
        throw new Error(`${msg}"${ep.pathTemplate}"`);
      }
      result[ep.pathTemplate] = ep;
    }
    return result;
  };

  return { build };
};
