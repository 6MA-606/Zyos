import { ZyosResponse } from "./libs/ZyosResponse"

// Zyos Configuration
const config = {
  defaultTokenKey: 'Authorization',
  defaultToken: null,
  getToken: () => {
    return localStorage.getItem('itbkk-token')
  },
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  defaultMethod: 'GET',
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
 * @param {function} options.getToken - Function to get and return the token
 * @param {(data: object) => object} options.computeFunction - Function to compute the data of the response before returning it
 * @returns {ZyosResponse} The response of the fetch
 */
async function fetch(url, options = {}) {
  
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

  if (options.useToken) {
    const optionToken = options.token || options.getToken || config.defaultToken || config.getToken || null
    const token = typeof optionToken === 'function' ? optionToken() : optionToken
    const tokenKey = options.tokenKey || config.defaultTokenKey
    if (token) {
      fetchOptions.headers[tokenKey] = `${token}`
    } else {
      throw new Error('Zyos Error: Token not provided')
    }
  }

  delete fetchOptions.useToken

  try {
    console.log(fetchOptions)
    const response = await window.fetch(url, fetchOptions)
    let data = await response.json()

    if (options.computeFunction && typeof options.computeFunction === 'function') {
      data = options.computeFunction(data)
    }

    if (response.ok) {
      return ZyosResponse.success(data, response.status)
    } else {
      return ZyosResponse.error(data.message, response.status)
    }
  } catch (error) {
    throw new Error('Zyos Error: ', error)
  }
}

export default {
  fetch
}