declare class ZyosConfig {
  /**
   * The default token key used in the headers.
   * Default: 'Authorization'
   */
  defaultTokenKey: string;

  /**
   * The default token to use for requests.
   */
  defaultToken: string | null;

  /**
   * A function to dynamically retrieve the token.
   */
  defaultTokenGetter: (() => string) | null;

  /**
   * The default headers to use for requests.
   * Default: { 'Content-Type': 'application/json' }
   */
  defaultHeaders: Record<string, string>;

  /**
   * The default HTTP method for requests.
   * Default: 'GET'
   */
  defaultMethod: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

  constructor();
}

declare class ZyosResponse {
  /**
   * The status of the response.
   */
  status: string;

  /**
   * The message of the response.
   */
  message: string | null;

  /**
   * The data of the response.
   */
  data: object | null;

  /**
   * The status code of the response.
   */
  statusCode: number | null;

  constructor(status: string, message: string | null, data: object | null, statusCode: number | null);

  /**
   * Creates a success response.
   * @param data The data to include in the response.
   * @param statusCode The HTTP status code of the response.
   */
  static success(data: object, statusCode: number): ZyosResponse;

  /**
   * Creates an error response.
   * @param message The error message.
   * @param statusCode The HTTP status code of the error response.
   */
  static error(message: string, statusCode: number): ZyosResponse;

  /**
   * Computes new data for the response by passing the current data to a function.
   * @param computeFunction A function to compute new data based on the current data.
   * @returns The updated ZyosResponse object.
   */
  compute(computeFunction: (data: object) => object): ZyosResponse;
}

declare function defineConfig(userDefinedConfig: Partial<ZyosConfig>): void;

declare function fetch(
  url: string,
  options?: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    headers?: Record<string, string>;
    body?: object;
    useToken?: boolean;
    token?: string;
    tokenKey?: string;
    tokenGetter?: () => string;
    computeFunction?: (data: object) => object;
  }
): Promise<ZyosResponse>;

export { ZyosResponse, ZyosConfig, defineConfig, fetch };
export default { fetch, defineConfig };
