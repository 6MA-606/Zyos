export const defaultConfigs = Object.freeze({
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
})