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

<br>

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
<br>

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

<br>

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

Wait for more documentation...