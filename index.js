import { HttpStatusCode } from "./enums/HttpStatusCode.js"
import { ZyosLoggingLevel } from "./enums/ZyosLoggingLevel.js"
import { ZyosResponse } from "./classes/ZyosResponse.js"
import { defaultConfigs } from "./defaultConfigs.js"
import { fetchData } from "./fetchData.js"
import { xhrRequest } from "./xhrRequest.js"

const configs = { ...defaultConfigs }

function defineConfig(userDefinedConfigs) {
  Object.assign(configs, userDefinedConfigs)
}

async function fetch(url, options = {}) {
  console.log('fetching...', url, options, configs)
  return await fetchData(url, options, configs)
}

async function xhr(url, options = {}) {
  console.log('xhr...', url, options, configs)
  return await xhrRequest(url, options)
}

function createResponse(statusCode, statusBrief, data, message) {
  return new ZyosResponse(statusCode, statusBrief, data, message)
}

export { ZyosResponse, HttpStatusCode, ZyosLoggingLevel }

export default {
  fetch,
  xhr,
  createResponse,
  defineConfig
}