declare class ZyosConfig {

  /**
   * Always encode the URI when making requests.
   * Default: false
   */
  alwaysEncodeURI: boolean;

  /**
   * Always use the token for requests.
   * Default: false
   */
  alwaysUseToken: boolean;

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

  /**
   * The default logging level for requests.
   * Default: 'all'
   * Options: 'none', 'all', 'errors'
   * 'none' - No logging
   * 'all' - Log all requests
   * 'errors' - Log only error responses
   */
  logging: 'none' | 'all' | 'warnings';

  /**
   * The async function to handle global responses.
   * @param response The response to handle.
   */
  globalResponseHandler: (response: ZyosResponse) => Promise<void>;
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
   * @param data The data to include in the response.
   * @param statusCode The HTTP status code of the error response.
   */
  static error(message: string, data: object, statusCode: number): ZyosResponse;

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
