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

/**
 * Makes a request to the specified URL with the given options.
 * @param url The URL to make the request to.
 * @param options Options to configure the request.
 * @returns A promise that resolves with the response of the request.
 * @example
 * ```javascript
 * const data = await zyos.fetch('https://api.example.com/data')
 */
declare function fetch(
  /**
   * The URL to make the request to.
   */
  url: string,

  /**
   * Options to configure the request.
   */
  options?: {
    /**
     * The HTTP method to use for the request.
     */
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

    /**
     * The headers to include in the request.
     */
    headers?: Record<string, string>

    /**
     * The body of the request.
     */
    body?: object

    /**
     * Use token in the request.
     */
    useToken?: boolean

    /**
     * Token to send in the request.
     */
    token?: string

    /**
     * Key to send the token in the headers.
     */
    tokenKey?: string

    /**
     * Function to get and return the token
     * @returns The token to send in the request.
     * @example
     * ```javascript
     * tokenGetter: () => {
     *  return localStorage.getItem('token')
     * }
     * ```
     */
    tokenGetter?: () => string

    /**
     * Number of times to retry the request if it fails (0 for no retries).
     */
    retry?: number

    /**
     * Timeout of the request in milliseconds (0 for no timeout).
     */
    timeout?: number

    /**
     * Function to compute the data of the response before returning it.
     * @param data The data of the response to compute.
     * @returns Computed data to include in the response.
     */
    computeFunction?: (data: object) => object

    /**
     * Don't use the global response handler for this request.
     */
    noGlobalResponseHandling?: boolean
  }
): Promise<ZyosResponse>

export { ZyosResponse, ZyosConfig, defineConfig, fetch }