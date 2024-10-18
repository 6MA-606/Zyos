/**
 * An enum representing the HTTP status codes.
 */
declare enum HttpStatusCode {
  /**
   * The request has succeeded.
   */
  OK = 200,

  /**
   * The request has been fulfilled and resulted in a new resource being created.
   */
  CREATED = 201,

  /**
   * The request has been accepted for processing, but the processing has not been completed.
   */
  ACCEPTED = 202,

  /**
   * The server successfully processed the request, but is returning information that may be from another source.
   */
  NON_AUTHORITATIVE_INFORMATION = 203,

  /**
   * The server successfully processed the request, but is not returning any content.
   */
  NO_CONTENT = 204,

  /**
   * The server is processing the request, but no response is available yet.
   */
  RESET_CONTENT = 205,

  /**
   * The server successfully processed the request, but is not returning any content.
   */
  PARTIAL_CONTENT = 206,

  /**
   * The server is delivering only part of the resource due to a range header sent by the client.
   */
  MULTI_STATUS = 207,

  /**
   * The server has fulfilled a GET request for the resource, and the response is a representation of the result of one
   * or more instance-manipulations applied to the current instance.
   */
  ALREADY_REPORTED = 208,

  /**
   * The server has fulfilled a request for the resource, and the response is a representation of the result of one or
   * more instance-manipulations applied to the current instance.
   */
  IM_USED = 226,

  /**
   * Indicates multiple options for the resource from which the client may choose.
   */
  MULTIPLE_CHOICES = 300,

  /**
   * This and all future requests should be directed to the given URI.
   */
  MOVED_PERMANENTLY = 301,

  /**
   * Tells the client to look at (browse to) another URL.
   */

  FOUND = 302,

  /**
   * Tells the client to look at (browse to) another URL.
   */
  SEE_OTHER = 303,

  /**
   * The resource has not been modified since the last request.
   */
  NOT_MODIFIED = 304,

  /**
   * The resource must be accessed through the proxy given by the Location field.
   */
  USE_PROXY = 305,

  /**
   * The requested resource is available only through a proxy, the address for which is provided in the response.
   */
  SWITCH_PROXY = 306,

  /**
   * The request should be repeated with another URI.
   */
  TEMPORARY_REDIRECT = 307,

  /**
   * The request and all future requests should be repeated using another URI.
   */
  PERMANENT_REDIRECT = 308,

  /**
   * The server cannot or will not process the request due to an apparent client error.
   */
  BAD_REQUEST = 400,

  /**
   * Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet
   * been provided.
   */
  UNAUTHORIZED = 401,

  /**
   * The request was valid, but the server is refusing action.
   */
  FORBIDDEN = 403,

  /**
   * The requested resource could not be found but may be available in the future.
   */
  NOT_FOUND = 404,

  /**
   * A request method is not supported for the requested resource.
   */
  METHOD_NOT_ALLOWED = 405,

  /**
   * The request was well-formed but was unable to be followed due to semantic errors.
   */
  NOT_ACCEPTABLE = 406,

  /**
   * The requested resource is capable of generating only content not acceptable according to the Accept headers sent
   * in the request.
   */
  PROXY_AUTHENTICATION_REQUIRED = 407,

  /**
   * The client must first authenticate itself with the proxy.
   */
  REQUEST_TIMEOUT = 408,

  /**
   * The server timed out waiting for the request.
   */
  CONFLICT = 409,

  /**
   * Indicates that the request could not be processed because of conflict in the request, such as an edit conflict.
   */
  GONE = 410,

  /**
   * Indicates that the resource requested is no longer available and will not be available again.
   */
  LENGTH_REQUIRED = 411,

  /**
   * The request did not specify the length of its content, which is required by the requested resource.
   */
  PRECONDITION_FAILED = 412,

  /**
   * The server does not meet one of the preconditions that the requester put on the request.
   */
  PAYLOAD_TOO_LARGE = 413,

  /**
   * The request is larger than the server is willing or able to process.
   */
  URI_TOO_LONG = 414,

  /**
   * The URI provided was too long for the server to process.
   */
  UNSUPPORTED_MEDIA_TYPE = 415,

  /**
   * The request entity has a media type that the server or resource does not support.
   */
  RANGE_NOT_SATISFIABLE = 416,

  /**
   * The client has asked for a portion of the file, but the server cannot supply that portion.
   */
  EXPECTATION_FAILED = 417,

  /**
   * The server cannot meet the requirements of the Expect request-header field.
   */
  IM_A_TEAPOT = 418,

  /**
   * This code was defined in 1998 as one of the traditional IETF April Fools' jokes, in RFC 2324, Hyper Text Coffee Pot
   * Control Protocol, and is not expected to be implemented by actual HTTP servers.
   */
  MISDIRECTED_REQUEST = 421,

  /**
   * The request was directed at a server that is not able to produce a response.
   */
  UNPROCESSABLE_ENTITY = 422,

  /**
   * The request was well-formed but was unable to be followed due to semantic errors.
   */
  LOCKED = 423,

  /**
   * The resource that is being accessed is locked.
   */
  FAILED_DEPENDENCY = 424,

  /**
   * The request failed due to failure of a previous request.
   */
  TOO_EARLY = 425,

  /**
   * Indicates that the server is unwilling to risk processing a request that might be replayed.
   */

  UPGRADE_REQUIRED = 426,

  /**
   * The client should switch to a different protocol such as TLS/1.0, given in the Upgrade header field.
   */
  PRECONDITION_REQUIRED = 428,

  /**
   * The origin server requires the request to be conditional.
   */
  TOO_MANY_REQUESTS = 429,

  /**
   * The user has sent too many requests in a given amount of time.
   */
  REQUEST_HEADER_FIELDS_TOO_LARGE = 431,

  /**
   * The server is unwilling to process the request because either an individual header field, or all the header fields
   * collectively, are too large.
   */
  UNAVAILABLE_FOR_LEGAL_REASONS = 451,

  /**
   * A server operator has received a legal demand to deny access to a resource or to a set of resources that includes
   * the requested resource.
   */
  INTERNAL_SERVER_ERROR = 500,

  /**
   * A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.
   */
  NOT_IMPLEMENTED = 501,

  /**
   * The server either does not recognize the request method, or it lacks the ability to fulfill the request.
   */
  BAD_GATEWAY = 502,

  /**
   * The server was acting as a gateway or proxy and received an invalid response from the upstream server.
   */
  SERVICE_UNAVAILABLE = 503,

  /**
   * The server is currently unavailable (because it is overloaded or down for maintenance).
   */
  GATEWAY_TIMEOUT = 504,

  /**
   * The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.
   */
  HTTP_VERSION_NOT_SUPPORTED = 505,

  /**
   * The server does not support the HTTP protocol version used in the request.
   */
  VARIANT_ALSO_NEGOTIATES = 506,

  /**
   * Transparent content negotiation for the request results in a circular reference.
   */
  INSUFFICIENT_STORAGE = 507,

  /**
   * The server is unable to store the representation needed to complete the request.
   */
  LOOP_DETECTED = 508,

  /**
   * The server detected an infinite loop while processing the request.
   */
  NOT_EXTENDED = 510,

  /**
   * Further extensions to the request are required for the server to fulfill it.
   */
  NETWORK_AUTHENTICATION_REQUIRED = 511,

  /**
   * The client needs to authenticate to gain network access.
   */
}

/**
 * A class representing a response from a request.
 */
declare class ZyosResponse {
  /**
   * The status code of the response.
   */
  statusCode: number | null;

  /**
   * The brief status of the response.
   */
  statusBrief: string;

  /**
   * The data of the response.
  */
  data: object | null;

  /**
    * The message of the response.
    */
  message: string | null;


  constructor(statusCode?: number | null, statusBrief?: string,  data?: object | null, message?: string | null);

  /**
   * Creates a success response.
   * @param data The data to include in the response.
   * @param statusCode The HTTP status code of the response.
   */
  static success(data?: object, statusCode?: number): ZyosResponse;

  /**
   * Creates an error response.
   * @param message The error message.
   * @param data The data to include in the response.
   * @param statusCode The HTTP status code of the error response.
   */
  static error(message?: string, data?: object, statusCode?: number): ZyosResponse;

  /**
   * Computes new data for the response by passing the current data to a function.
   * @param computeFunction A function to compute new data based on the current data.
   * @returns The updated ZyosResponse object.
   */
  compute(computeFunction: (data: object) => object): ZyosResponse;
}

interface ZyosConfig {
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
}

/**
 * 
 * @param userDefinedConfig 
 */
declare function defineConfig(userDefinedConfig: ZyosConfig): void;

/**
 * Creates a response object with the specified properties.
 * @param statusCode The status code of the response.
 * @param statusBrief The brief status of the response.
 * @param data The data of the response.
 * @param message The message of the response.
 * @returns A new ZyosResponse object.
 */
declare function createResponse(statusCode: number | null, statusBrief: string, data: object | null, message: string | null): ZyosResponse;

interface ZyosFetchOptions {
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
  options?: ZyosFetchOptions

): Promise<ZyosResponse>

export { ZyosResponse, ZyosConfig, HttpStatusCode }
export default { defineConfig, createResponse, fetch }