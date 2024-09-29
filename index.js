
class ZyosConfig {

  /**
   * Create a new ZyosConfig object
   */
  constructor() {
    this.alwaysEncodeURI = false
    this.alwaysUseToken = false
    this.defaultTokenKey = 'Authorization'
    this.defaultToken = null
    this.defaultTokenGetter = null
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
    this.defaultMethod = 'GET'
    this.logging = 'all'
    this.globalResponseHandler = null
  }
}

class ZyosResponse {
  
  /**
   * Create a new ZyosResponse object
   * @param {string} status - Status of the response
   * @param {string} message - Message of the response
   * @param {object} data - Data of the response
   * @param {number} statusCode - Status code of the response
  */
  constructor(status, message, data, statusCode) {
    this.status = status
    this.message = message || null
    this.data = data || null
    this.statusCode = statusCode || null
  }

  /**
   * Create a success response
   * @param {string} data - Data to send in the response
   * @param {number} statusCode - Status code of the response
   * @returns 
  */
  static success(data, statusCode) {
    return new ZyosResponse('success', null, data, statusCode)
  }
  
  /**
   * Create an error response
   * @param {string} message - Error message to send in the response
   * @param {number} statusCode - Status code of the response
   * @returns 
  */
  static error(message, data, statusCode) {
    return new ZyosResponse('error', message, data, statusCode)
  }
  
  /**
   * Compute the data of the response with a function and return the response that contains the computed data.
   * @param {(data: object) => object} computeFunction - A function that receives the current data and returns the computed data.
   * @returns {ZyosResponse} The updated response object.
  */
  compute(computeFunction) {
    this.data = computeFunction(this.data)
    return this
  }
}

/** @type {ZyosConfig} */
const config = new ZyosConfig()

/**
 * Define the Zyos configuration
 * @param {ZyosConfig} userDefinedConfig - Configuration to define
 */
function defineConfig(userDefinedConfig) {
  Object.assign(config, userDefinedConfig)
}

/**
 * Fetch data from an API with Zyos
 * @param {string} url - URL to fetch
 * @param {object} options - Fetch options
 * @param {'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'} options.method - Method to use in the request
 * @param {object} options.headers - Headers to send in the request
 * @param {object} options.body - Body to send in the request
 * @param {boolean} options.useToken - Use token in the request
 * @param {string} options.token - Token to send in the request
 * @param {string} options.tokenKey - Key to send the token in the headers
 * @param {function} options.tokenGetter - Function to get and return the token
 * @param {boolean} options.noGlobalResponseHandler - Don't use the global response handler
 * @param {(data: object) => object} options.computeFunction - Function to compute the data of the response before returning it
 * @returns {Promise<ZyosResponse>} The response of the fetch
*/
async function fetch(url, options = {}) {

  if (!url) {
    throw new Error('Zyos Error: URL not provided')
  } else if (config.alwaysEncodeURI) {
    url = encodeURI(url)
  }

  const headers = {
    ...config.defaultHeaders,
    ...options.headers
  }
  
  const method = options.method || config.defaultMethod

  const fetchOptions = {
    ...options,
    method,
    headers,
  }

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body)
  }

  let useToken = false

  if (options.useToken !== undefined) {
    useToken = options.useToken
  } else {
    useToken = config.alwaysUseToken
  }

  if (useToken) {
    const optionToken = options.token || options.tokenGetter || config.defaultToken || config.defaultTokenGetter || null
    const token = typeof optionToken === 'function' ? optionToken() : optionToken
    const tokenKey = options.tokenKey || config.defaultTokenKey
    if (token) {
      fetchOptions.headers[tokenKey] = `${token}`
    } else {
      if (config.logging === 'warnings' || config.logging === 'all') {
        console.warn('Zyos Warn: Zyos is configured to use token but no token was provided.')
      }
    }
  }

  delete fetchOptions.useToken
  delete fetchOptions.token
  delete fetchOptions.tokenKey
  delete fetchOptions.tokenGetter

  try {
    const response = await window.fetch(url, fetchOptions)
    let data

    try {
      data = await response.json()
    } catch (error) {
      if (config.logging === 'warnings' || config.logging === 'all') {
        console.warn('Zyos Warn: Can\'t parse response to JSON. Returning empty object.')
      }
      data = {}
    }

    if (options.computeFunction && typeof options.computeFunction === 'function') {
      data = options.computeFunction(data)
    }

    let responseObj = null

    if (response.ok) {
      responseObj = ZyosResponse.success(data, response.status)
      if (config.logging === 'all') {
        console.log('Zyos Log: Success response:', responseObj)
      }
    } else {
      responseObj =  ZyosResponse.error(data.message, data, response.status)
      if (config.logging === 'all') {
        console.log('Zyos Log: Error response:', responseObj)
      }
    }

    if (!options.noGlobalResponseHandler && config.globalResponseHandler && typeof config.globalResponseHandler === 'function') {
      await config.globalResponseHandler(responseObj)
    }

    return responseObj
  } catch (error) {
    throw new Error('Zyos Error: ', error)
  }
}

export { ZyosResponse, ZyosConfig }

export default {
  fetch,
  defineConfig
}