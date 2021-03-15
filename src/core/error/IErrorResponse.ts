/**
 * Represents an error response from the server
 */
export interface IErrorResponse {
    // A descriptive message of the error
    message: string
    // The HTTP status code of the error > 400, 403, 500
    status: string
    // A more precise error code to pinpoint the error
    code: string
}
