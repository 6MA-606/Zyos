class ZyosResponse {
  
  /**
   * Create a new ZyosResponse object
   * @param {number} statusCode - Status code of the response
   * @param {string} statusBrief - Brief status of the response
   * @param {object} data - Data of the response
   * @param {string} message - Message of the response
  */
  constructor(statusCode, statusBrief, data, message) {
    this.statusCode = statusCode || null
    this.statusBrief = statusBrief || null
    this.data = data || null
    this.message = message || null
  }

  /**
   * Create a success response
   * @param {string} data - Data to send in the response
   * @param {number} statusCode - Status code of the response
   * @returns 
  */
  static success(data = null, statusCode = null) {
    return new ZyosResponse(statusCode, 'success', data, null)
  }
  
  /**
   * Create an error response
   * @param {string} message - Error message to send in the response
   * @param {number} statusCode - Status code of the response
   * @returns 
  */
  static error(message = null, data = null, statusCode = null) {
    return new ZyosResponse(statusCode, 'error', data, message)
  }

  /**
   * Set the status code of the response
   * @param {number} statusCode - Status code of the response
   * @returns {ZyosResponse} The updated response object.
   */
  setStatusCode(statusCode) {
    this.statusCode = statusCode
    return this
  }

  /**
   * Set the status brief of the response
   * @param {string} statusBrief - Brief status of the response
   * @returns {ZyosResponse} The updated response object.
   */
  setStatusBrief(statusBrief) {
    this.statusBrief = statusBrief
    return this
  }

  /**
   * Set the data of the response
   * @param {object} data - Data of the response
   * @returns {ZyosResponse} The updated response object.
   */
  setData(data) {
    this.data = data
    return this
  }

  /** 
   * Set the message of the response
   * @param {string} message - Message of the response
   * @returns {ZyosResponse} The updated response object.
   */
  setMessage(message) {
    this.message = message
    return this
  }

  /**
   * Check if the response is ok
   * @returns {boolean} True if the response is ok, false otherwise
   */
  get ok() {
    return this.statusBrief === 'success'
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

/** @type {import(".").ZyosConfig} */
const config = {
  alwaysEncodeURI: false,
  alwaysUseToken: false,
  defaultTokenKey: 'Authorization',
  defaultToken: null,
  defaultTokenGetter: null,
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  defaultMethod: 'GET',
  logging: 'all',
  globalResponseHandler: null
}

/**
 * Define the Zyos configuration
 * @param {import(".").ZyosConfig} userDefinedConfig - The user defined configuration
 */
function defineConfig(userDefinedConfig) {
  Object.assign(config, userDefinedConfig)
}

/**
 * Create a response object
 * @param {number} statusCode - Status code of the response
 * @param {string} statusBrief - Brief status of the response
 * @param {object} data - Data of the response
 * @param {string} message - Message of the response
 * @returns {ZyosResponse} The response object
 */
function createResponse(statusCode, statusBrief, data, message) {
  return new ZyosResponse(statusCode, statusBrief, data, message)
}


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
    mode: 'cors',
    cache: 'no-cache',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    ...options,
    method,
    headers,
  }

  delete fetchOptions.useToken
  delete fetchOptions.token
  delete fetchOptions.tokenKey
  delete fetchOptions.tokenGetter
  delete fetchOptions.retry
  delete fetchOptions.timeout

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

  let attempts = 0
  let retry = options.retry || 0
  const timeout = options.timeout || 5000
  
  while (attempts <= retry) {
    const controller = new AbortController()
    fetchOptions.signal = controller.signal

    let timeoutPromise = null

    if (timeout > 0) {
      timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => {
          controller.abort()
          reject(new Error('Request timeout'))
        }, timeout)
      )
    }
    
    try {
      const fetchPromise = window.fetch(url, fetchOptions)

      let response = null
      if (timeout > 0) {
        response = await Promise.race([fetchPromise, timeoutPromise])
      } else {
        response = await fetchPromise
      }

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
        responseObj = ZyosResponse.error(data.message, data, response.status)
        if (config.logging === 'all') {
          console.log('Zyos Log: Error response:', responseObj)
        }
      }

      if (!options.noGlobalResponseHandling && config.globalResponseHandler && typeof config.globalResponseHandler === 'function') {
        await config.globalResponseHandler(responseObj)
      }

      return responseObj
    } catch (error) {
      if (config.logging === 'warnings' || config.logging === 'all') {
        console.warn('Zyos Warn: ' + error)

        if (timeout > 0) {
          console.warn('Zyos Warn: Timeout reached.')
        }

        if (error.name === 'AbortError') {
          console.warn('Zyos Warn: Request aborted.')
        }

        if (attempts < retry) {
          console.warn('Zyos Warn: Retrying... (' + (retry - attempts)  + ' retries left)')
        }

        if (attempts === retry) {
          console.warn('Zyos Warn: No more retries left.')
        }

      }
      attempts++
    }
  }
  console.error('Zyos Error: Max retries reached.')
}

export { HTTPStatusCode, ZyosResponse, ZyosConfig }

export default {
  fetch,
  createResponse,
  defineConfig
}