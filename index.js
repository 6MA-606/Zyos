import { HttpStatusCode } from "./enum/HttpStatusCode"

class ZyosResponse {
  
  constructor(statusCode, statusBrief, data, message) {
    this.statusCode = statusCode || null
    this.statusBrief = statusBrief || null
    this.data = data || null
    this.message = message || null
  }

  static success(data = null, statusCode = null) {
    return new ZyosResponse(statusCode, 'success', data, null)
  }
  
  static error(message = null, data = null, statusCode = null) {
    return new ZyosResponse(statusCode, 'error', data, message)
  }

  setStatusCode(statusCode) {
    this.statusCode = statusCode
    return this
  }

  setStatusBrief(statusBrief) {
    this.statusBrief = statusBrief
    return this
  }

  setData(data) {
    this.data = data
    return this
  }

  setMessage(message) {
    this.message = message
    return this
  }

  get ok() {
    return this.statusBrief === 'success'
  }
  
  compute(computeFunction) {
    this.data = computeFunction(this.data)
    return this
  }
}

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

function defineConfig(userDefinedConfig) {
  Object.assign(config, userDefinedConfig)
}
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

export { ZyosResponse, HttpStatusCode }

export default {
  fetch,
  createResponse,
  defineConfig
}