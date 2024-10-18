# Important Announcement
I decided to **republish** `zyos` on npm. The reason is that I think zyos is **not stable enough** to be published as to `1.0.0`. I will publish the `1.0.0-beta.0001` at **20 October 2024 around 12:00 AM (UTC+7)**. I will also update the documentation and the codebase. I hope you understand my decision. Thank you 😊.

<div align="center">
<h1>Zyos</h1>

<a href="#">
  <img src="https://github.com/user-attachments/assets/19cf1b13-dd7d-425a-9bdf-8acd770efaec" width="220px" />
</a>

[![npm](https://img.shields.io/npm/v/zyos?style=for-the-badge&colorB=51C838)](https://www.npmjs.com/package/zyos)
[![npm-download](https://img.shields.io/npm/d18m/zyos?style=for-the-badge)](https://www.npmjs.com/package/zyos)
[![license](https://img.shields.io/badge/MIT-orange?style=for-the-badge&label=License)](#)

Simplifying `window.fetch()` for easier HTTP requests.

</div>

# What is Zyos?

Zyos is a small library that wraps around `window.fetch()` to make it simpler to use for HTTP requests. It offers a straightforward API for working with requests and responses.

> **Note:** Zyos is designed for modern browsers that support `window.fetch()`. If you're targeting older browsers, you might need a polyfill.

> **Note:** Zyos works best with JSON data. If you need to handle other data types, you'll need to customize the library.

> **Note:** This library was created by **Sittha Manittayakul, a 3rd-year student at King Mongkut's University of Technology Thonburi (KMUTT)**, as part of the INT222 project for the 1st semester of the 2024 academic year.

## Installation

```bash
npm install zyos
```

## Usage

### Simple Request

**GET Request**

```javascript
import zyos from 'zyos'

// Make a GET request (GET is the default method)
const response = await zyos.fetch('https://jsonplaceholder.typicode.com/posts/1')
console.log(response.data)
```

**POST Request**

```javascript
import zyos from 'zyos'

// Make a POST request
const response = await zyos.fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  body: {
    title: 'foo',
    body: 'bar',
    userId: 1
  }
})
console.log(response.data)
```

---

### Request Options

**headers: object**

You can pass headers in the request by providing an object with key-value pairs. The header name is the key, and the value is the header’s content.

If you set custom headers that match the default headers, your custom headers will override them. The default headers are:

`{ 'Content-Type': 'application/json' }`

```javascript
import zyos from 'zyos'

// Make a GET request with custom headers
const response = await zyos.fetch('https://jsonplaceholder.typicode.com/posts/1', {
  headers: {
    'Your-Header': 'Your-Value'
  }
})
console.log(response.data)
```

<br />

**method: string**

You can set the HTTP method (GET, POST, PUT, DELETE, etc.) as a string.

The default method is `'GET'`.

```javascript
import zyos from 'zyos'

// Specify the method for the request
const response = await zyos.fetch('https://jsonplaceholder.typicode.com/posts/1', {
  method: 'GET' // or 'POST', 'PUT', etc.
})
console.log(response.data)
```

<br />

**body: object**

To send data with the request, pass an object as the body. This is useful for POST or PUT requests.

```javascript
import zyos from 'zyos'

// Send a POST request with data
const response = await zyos.fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  body: {
    title: 'foo',
    body: 'bar',
    userId: 1
  }
})
console.log(response.data)
```

<br />

**useToken: boolean**

If your request requires a token (for example, for authentication), set `useToken` to `true`. Zyos will check for a token in the following order:

1. The `token` option
2. The `tokenGetter` function
3. The default token (`defaultToken`) or token getter function (`defaultTokenGetter`) defined in the configuration

If not defined, Zyos will check `alwaysUseToken` setting in the configuration instead.

This option will override the `alwaysUseToken` setting in the configuration.

```javascript
import zyos from 'zyos'

// Make a request with a token
const response = await zyos.fetch('https://jsonplaceholder.typicode.com/posts/1', {
  useToken: true
})
console.log(response.data)
```

<br />

**token: string**

**_Warning: Hardcoding tokens is not safe and should be avoided._**

You can manually provide a token by setting the `token` option. This is used only if `useToken` is `true`.

```javascript
import zyos from 'zyos'

// Request with a hardcoded token
const response = await zyos.fetch('https://jsonplaceholder.typicode.com/posts/1', {
  useToken: true,
  token: 'your-token'
})
console.log(response.data)
```

<br />

**tokenGetter: function**

Instead of hardcoding the token, you can pass a function that returns the token. This function is called when making the request.

```javascript
import zyos from 'zyos'

// Request using a token from a function
const response = await zyos.fetch('https://jsonplaceholder.typicode.com/posts/1', {
  useToken: true,
  tokenGetter: () => {
    return 'your-token'
  }
})
console.log(response.data)
```

<br />

**computedFunction: function**

You can provide a function to process or modify the response data before it is returned.

```javascript
import zyos from 'zyos'

// Modify response data before it's returned
const response = await zyos.fetch('https://jsonplaceholder.typicode.com/posts/1', {
  computedFunction: (data) => {
    data.timestamp = Date.now()
    return data // Return the modified data
  }
})
console.log(response.data) // { userId: 1, id: 1, title: '...', body: '...', timestamp: 1630000000000 }
```

<br />

**timeout: number**

You can set a timeout for the request in milliseconds. If the request takes longer than the timeout, it will be rejected.

```javascript
import zyos from 'zyos'

// Modify response data before it's returned
const response = await zyos.fetch('https://jsonplaceholder.typicode.com/posts/1', {
  timeout: 5000 // 5 seconds
})
console.log(response.data) // { userId: 1, id: 1, title: '...', body: '...', timestamp: 1630000000000 }
```

<br />

**retry: number**

You can set the number of times to retry the request if it fails. The default is `0` (no retries).

> If you set a retry and a timeout, the timeout will be applied to each retry.

```javascript
import zyos from 'zyos'

// Modify response data before it's returned
const response = await zyos.fetch('https://jsonplaceholder.typicode.com/posts/1', {
  retry: 3 // Retry 3 times
})
console.log(response.data) // { userId: 1, id: 1, title: '...', body: '...', timestamp: 1630000000000 }
```

---

### Defining Config

You can set default values for all requests using `zyos.defineConfig()`.

```javascript
import zyos from 'zyos'

// Define default settings for requests
zyos.defineConfig({
  alwaysUseToken: true, // default is false
  alwaysEncodeURI: true, // default is true

  /* Default is
    defaultHeaders: {
      'Content-Type': 'application/json'
    }
  */
  defaultHeaders: {
    'Your-Header': 'Your-Value'
  },
  defaultMethod: 'GET', // default is 'GET'
  defaultToken: 'your-token', // default is null
  defaultTokenGetter: () => { // default is null
    return 'your-token from getter'
  },
  loggings: 'all', // default is 'all'
  globalResponseHandling: (response) => { // default is null
    console.log(response)
  }
})
```

You can define default headers, the default method, and token options. These will be applied if specific settings are not provided in the request.
