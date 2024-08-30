declare module 'zyos' {
  export class ZyosConfig {
    defaultTokenKey: string;
    defaultToken: string | null;
    defaultTokenGetter: (() => string) | null;
    defaultHeaders: { [key: string]: string };
    defaultMethod: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

    constructor();
  }

  export class ZyosResponse {
    status: string;
    message: string | null;
    data: any;
    statusCode: number | null;

    constructor(status: string, message: string | null, data: any, statusCode: number | null);

    static success(data: any, statusCode?: number): ZyosResponse;
    static error(message: string, statusCode?: number): ZyosResponse;
    
    compute(computeFunction: (data: any) => any): ZyosResponse;
  }

  /**
   * Define the Zyos configuration
   * @param userDefinedConfig - The user-defined configuration for Zyos
   */
  export function defineConfig(userDefinedConfig: ZyosConfig): void;

  /**
   * Fetch data from an API with Zyos
   * @param url - URL to fetch
   * @param options - Fetch options
   */
  export function fetch(url: string, options?: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    headers?: { [key: string]: string };
    body?: any;
    useToken?: boolean;
    token?: string;
    tokenKey?: string;
    tokenGetter?: () => string;
    computeFunction?: (data: any) => any;
  }): Promise<ZyosResponse>;
  
  const zyos: {
    fetch: typeof fetch
    defineConfig: typeof defineConfig
  }

  export default zyos
}
