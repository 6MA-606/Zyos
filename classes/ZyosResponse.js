export class ZyosResponse {
  
  constructor(statusCode, statusBrief, data, message, httpResponse) {
    this.statusCode = statusCode || null
    this.statusBrief = statusBrief || null
    this.data = data || null
    this.message = message || null
    this.httpResponse = httpResponse || null
  }

  static success(data = null, statusCode = null, httpResponse = null) {
    return new ZyosResponse(statusCode, 'success', data, null, httpResponse)
  }
  
  static error(message = null, data = null, statusCode = null, httpResponse = null) {
    return new ZyosResponse(statusCode, 'error', data, message, httpResponse)
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