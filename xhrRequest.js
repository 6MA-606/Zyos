export function xhrRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(options.method || 'GET', url)

    // Set request headers
    if (options.headers) {
      for (const key in options.headers) {
        if (options.headers.hasOwnProperty(key)) {
          xhr.setRequestHeader(key, options.headers[key])
        }
      }
    }

    // Set response type
    if (options.responseType) {
      xhr.responseType = options.responseType
    }

    // Set timeout
    if (options.timeout) {
      xhr.timeout = options.timeout
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response)
      } else {
        reject(new Error(xhr.statusText))
      }
    }

    xhr.onerror = () => reject(new Error(xhr.statusText));
    xhr.ontimeout = () => reject(new Error('Request timeout'));

    // Send request with optional body
    xhr.send(options.body || null)
  })
}