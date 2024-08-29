import { ZyosResponse } from './libs/ZyosResponse';

export type fetchOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers: object;
  body: object;
  useToken: boolean;
  token: string;
  tokenKey: string;
  getToken: () => string;
  computeFunction: (data: object) => object;
}

export async function fetch(url: string, options: fetchOptions): Promise<ZyosResponse>