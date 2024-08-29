export class ZyosResponse {

  /**
   * Create a new ZyosResponse object
   * @param {string} status - Status of the response
   * @param {string} message - Message of the response
   * @param {object} data - Data of the response
   * @param {number} statusCode - Status code of the response
   */
  constructor(status, message, data, statusCode) {
    this.status = status
    this.message = message || null
    this.data = data || null
    this.statusCode = statusCode || null
  }

  /**
   * Create a success response
   * @param {string} data - Data to send in the response
   * @param {number} statusCode - Status code of the response
   * @returns 
   */
  static success(data, statusCode) {
    return new ZyosResponse('success', null, data, statusCode)
  }

  /**
   * Create an error response
   * @param {string} message - Error message to send in the response
   * @param {number} statusCode - Status code of the response
   * @returns 
   */
  static error(message, statusCode) {
    return new ZyosResponse('error', message, null, statusCode)
  }

  /**
   * Compute the data of the response with a function and return the response that contains the computed data.
   * @param {(data: object) => object} computeFunction - A function that receives the current data and returns the computed data.
   * @returns {ZyosResponse} The updated response object.
   */
  compute(computeFunction) {
    this.data = computeFunction(this.data)
    return this
  }
}