import { IErrorResponse } from 'core/error/IErrorResponse'

/**
 * Represents response message from socket events
 */
export interface IEventResponse<T> {
    data?: T
    error?: IErrorResponse
}
