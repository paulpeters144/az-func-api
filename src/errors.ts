export class ApiAlreadyBuiltError extends Error {
   constructor() {
      super('The API can only be built once.');
      this.name = 'ApiAlreadyBuiltError';
   }
}

export class ApiNotBuiltError extends Error {
   constructor() {
      super('The API has not been built yet.');
      this.name = 'ApiNotBuiltError';
   }
}
