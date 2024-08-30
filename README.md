# Zyos

Make `window.fetch()` easier to use.

This is a simple wrapper around `window.fetch()` that makes it easier to use. It's a small library that provides a simple API to make HTTP requests.

## Installation

```bash
npm install zyos
```

## Usage

### Simple Request

**GET Request**

```javascript
import zyos from 'zyos'

// Make a GET request (default method if not specified method)
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

**headers: string**

You can set headers in the request by passing an object with the headers you want to set. The headers object should have the header name as the key and the header value as the value.

User defined headers will override the default headers if they have the same key, but the default headers will be used if the user defined headers don't have the same key.

defaultHeaders: `{ 'Content-Type': 'application/json' }`

If you want to set your own `Content-Type`, you can set it in the headers option, it will override the default `Content-Type`.

```javascript
import zyos from 'zyos'

// Make a GET request with headers
const response = await zyos.fetch('https://jsonplaceholder.typicode.com/posts/1', {
  headers: {
    'Your-Header': 'Your-Value'
  },
})
console.log(response.data)
```

<br />

**method: string**

You can set the method in the request by passing a string with the method you want to set.

defaultMethod: `'GET'`

```javascript
import zyos from 'zyos'

// Make a request with method specified
const response = await zyos.fetch('https://jsonplaceholder.typicode.com/posts/1', {
  method: 'GET' // or 'POST', 'PUT', 'DELETE', etc.
})
console.log(response.data)
```

<br />

**body: object**

You can set the body in the request by passing an object with the body you want to set.

```javascript
import zyos from 'zyos'

// Make a POST request with body
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

If you want to make a request with a token, you can set `useToken` to `true`.
Zyos will get the token from `token` option first, if it's not set, Zyos will get the token from `tokenGetter` option, if it's not set, Zyos will get the token from `defaultToken` in default config (default is `null`), if it's not set, Zyos will get the token from `defaultTokenGetter` in default config (default is `null`)`.

```javascript
import zyos from 'zyos'

// Make a request with token
const response = await zyos.fetch('https://jsonplaceholder.typicode.com/posts/1', {
  useToken: true
})
console.log(response.data)
```

<br />

**token: string**

**_Not recommended, if you hardcode the token in the code, it's not safe._**

You can set the token in the request by passing a string with the token you want to set. This option will be used if `useToken` is set to `true`.

defaultToken: `null`

```javascript
import zyos from 'zyos'

// Make a request with token
const response = await zyos.fetch('https://jsonplaceholder.typicode.com/posts/1', {
  useToken: true,
  token: 'your-token'
})
console.log(response.data)
```

<br />

**tokenGetter: function**

You can set the token getter in the request by passing a function that returns the token you want to set. This option will be used if `useToken` is set to `true`.

defaultTokenGetter: `null`

```javascript
import zyos from 'zyos'

// Make a request with token
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

You can set the computed function to compute the response data before returning it.

```javascript
import zyos from 'zyos'

// Make a request with computed function
const response = await zyos.fetch('https://jsonplaceholder.typicode.com/posts/1', {
  computedFunction: (data) => { // data is the response body
    data.timestamp = Date.now()
    return data // return the computed data that added timestamp
  }
})
console.log(response.data) // { userId: 1, id: 1, title: '...', body: '...', timestamp: 1630000000000 }
```

---

### Defining Config

You can define the default config for all requests by calling `zyos.defineConfig()`.

i.e.
```javascript
import zyos from 'zyos'

zyos.defineConfig({
  defaultHeaders: {
    'Your-Header': 'Your-Value'
  },
  defaultMethod: 'GET',
  defaultToken: 'your-token',
  defaultTokenGetter: () => {
    return 'your-token from getter'
  }
})
```

You can config the default headers, default method, default token, and default token getter in the default config. The default config will be used if the options are not set in the request.