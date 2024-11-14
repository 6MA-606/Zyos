import { HttpStatusCode } from "./enums/HttpStatusCode.js"
import { ZyosLoggingLevel } from "./enums/ZyosLoggingLevel.js"
import { ZyosResponse } from "./classes/ZyosResponse.js"
import { fetch } from "./fetch.js"

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

export { ZyosResponse, HttpStatusCode, ZyosLoggingLevel }

export default {
  fetch,
  createResponse,
  defineConfig
}