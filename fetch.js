import { ZyosResponse } from './classes/ZyosResponse.js'
import { HttpStatusCode } from "./enums/HttpStatusCode.js"
import { ZyosLoggingLevel } from "./enums/ZyosLoggingLevel.js"

const CONTENT_TYPE_JSON = 'application/json'
const CONTENT_TYPE_TEXT = 'text/'
const CONTENT_TYPE_HEADER = 'Content-Type'

async function parseResponse(response) {
  const contentType = response.headers.get(CONTENT_TYPE_HEADER)
  if (contentType && contentType.includes(CONTENT_TYPE_JSON)) {
    return await response.json()
  } else if (contentType && contentType.includes(CONTENT_TYPE_TEXT)) {
    return await response.text()
  } else {
    return await response.blob()
  }
}

function handleParseError(config) {
  if (config.logging === ZyosLoggingLevel.WARNINGS || config.logging === ZyosLoggingLevel.ALL) {
    console.warn('Zyos Warn: Can\'t parse response data. Returning null.')
  }
}

function createTimeoutPromise(controller, timeout) {
  if (timeout <= 0) return null
  return new Promise((_, reject) => {
    setTimeout(() => {
      controller.abort()
      reject(new Error('Request timeout'))
    }, timeout)
  })
}

async function getResponse(fetchPromise, timeoutPromise, timeout) {
  if (timeout > 0) {
    return await Promise.race([fetchPromise, timeoutPromise])
  }
  return await fetchPromise
}

async function handleResponse(response, config, options) {
  let data = null
  try {
    data = await parseResponse(response)
  } catch (error) {
    handleParseError(config)
  }

  if (options.computeFunction && typeof options.computeFunction === 'function') {
    data = options.computeFunction(data)
  }

  return data
}

function createResponseObject(response, data, config) {
  let responseObj = null
  if (response.ok) {
    responseObj = ZyosResponse.success(data, response.status, response)
    if (config.logging === ZyosLoggingLevel.ALL) {
      console.log('Zyos Log: Success response:', responseObj)
    }
  } else {
    responseObj = ZyosResponse.error(data.message, data, response.status, response)
    if (config.logging === ZyosLoggingLevel.ALL) {
      console.error('Zyos Log: Error response:', responseObj)
    }
  }
  return responseObj
}

async function handleGlobalResponse(responseObj, config, options) {
  if (!options.noGlobalResponseHandling && config.globalResponseHandler && typeof config.globalResponseHandler === 'function') {
    await config.globalResponseHandler(responseObj)
  }
}

function handleFetchError(error, config, timeout, attempts, retry) {
  if (config.logging === ZyosLoggingLevel.WARNINGS || config.logging === ZyosLoggingLevel.ALL) {
    console.warn('Zyos Warn: ' + error)

    if (timeout > 0) {
      console.warn('Zyos Warn: Timeout reached.')
    }

    if (error.name === 'AbortError') {
      console.warn('Zyos Warn: Request aborted.')
    }

    if (attempts < retry) {
      console.warn('Zyos Warn: Retrying... (' + (retry - attempts) + ' retries left)')
    }
  }
}

export async function fetch(url, options = {}) {

  if (!url) {
    throw new Error('Zyos Error: URL not provided')
  } else if (config.alwaysEncodeURI) {
    url = encodeURI(url)
  }

  const CONTENT_TYPE_JSON = 'application/json'
  const CONTENT_TYPE_HEADER = 'Content-Type'

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

  // Remove unnecessary properties from fetchOptions
  ['useToken', 'token', 'tokenKey', 'tokenGetter', 'retry', 'timeout'].forEach(prop => delete fetchOptions[prop])

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    fetchOptions.body = JSON.stringify(options.body)
  } else if (options.body && options.body instanceof FormData) {
    if (fetchOptions.headers[CONTENT_TYPE_HEADER] === CONTENT_TYPE_JSON) {
      if (config.logging === 'warnings' || config.logging === 'all') {
        console.warn('Zyos Warn: FormData provided but Content-Type is application/json. Removing Content-Type header.')
      }
      delete fetchOptions.headers[CONTENT_TYPE_HEADER]
    }
    fetchOptions.body = options.body
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
  let responseObj = null
  let retry = options.retry || 0
  const timeout = options.timeout || 5000
  
  while (attempts <= retry) {
    const controller = new AbortController()
    fetchOptions.signal = controller.signal

    const timeoutPromise = createTimeoutPromise(controller, timeout)
    
    try {
      const fetchPromise = window.fetch(url, fetchOptions)
      const response = await getResponse(fetchPromise, timeoutPromise, timeout)
      const data = await handleResponse(response, config, options)

      const responseObj = createResponseObject(response, data, config)

      await handleGlobalResponse(responseObj, config, options)

      if (response.ok) break
    } catch (error) {
      handleFetchError(error, config, timeout, attempts, retry)
      if (attempts >= retry) {
        responseObj = ZyosResponse.error('Max retries reached', {}, HttpStatusCode.INTERNAL_SERVER_ERROR, null)
      } 
    }

    attempts++
  }
  console.error('Zyos Error: Max retries reached.')

  return responseObj
}