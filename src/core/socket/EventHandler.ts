import { IErrorResponse } from 'core/error/IErrorResponse'
import { IEventResponse } from './IEventResponse'

/**
 * Websocket event handler takes two optional function arguments for
 * handling either/none/both error and data.
 */
export interface IWebsocketEventHandler<T> {
    dataHandler?: (data: T) => void
    errorHandler?: (error: IErrorResponse) => void
}

/**
 * Describes an event executor method that takes an object of IEventResponse as arguments.
 */
export type EventExecutor<T> = ({ data, error }: IEventResponse<T>) => void

/**
 * Returns an executor function that executes the handler functions for event data/error response.
 * It executes only if a handler is provided and the event returns data/error for the handler.
 * e.g if the event returns an error object, and there is no error handler, it will not handle the error and continues in silence.
 * @param event handler methods
 * @returns executor function for the handlers
 */
export function WebsocketEvent<T>({ dataHandler, errorHandler }: IWebsocketEventHandler<T> = {}): EventExecutor<T> {
    return function executor(payload: IEventResponse<T> | undefined): void {
        if (dataHandler) {
            if (payload?.data) dataHandler(payload.data)
            // Handles data that is undefined, or has payload that is not wrapped in {data, error} object
            else if (!payload?.error) dataHandler(payload as T)
        }
        if (errorHandler && payload?.error) errorHandler(payload.error)
    }
}
