export type Verb = "get" | "put" | "post";

export interface IRequest<TBody extends {} = null, THeaders extends {} = null, TParameters extends {} = null> {
  headers?: { [index: string]: string | string[] };
  parameters?: { [index: string]: string };
  body?: TBody;
}

export interface IEndpoint<TRequest extends {}, TResult extends {}> {
  path: string;
  bodySchema: any;
  method: Verb;
  body?: any;
  handler: (requestData: IRequest<TRequest>) => Promise<TResult> | TResult;
}

export interface IEndpointAPI {
  path: string;
  endpoints: Array<IEndpoint<IRequest, {}>>;
}
