/**
 * Represents an error response from the server
 */
export interface IErrorResponse {
    // A descriptive message of the error
    message: string
    // The HTTP status name of the error > FORBIDDEN, BAD_REQUEST...
    status: string
    // The HTTP status code of the error > 400, 404, 500...
    statusCode: number
    // A more precise error code to pinpoint the error
    code: string
}
