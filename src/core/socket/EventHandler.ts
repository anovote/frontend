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
export const WebsocketEvent = <T>({ dataHandler, errorHandler }: IWebsocketEventHandler<T> = {}): EventExecutor<T> => {
    return function executor({ data, error }: IEventResponse<T>): void {
        if (dataHandler && data) dataHandler(data)
        if (errorHandler && error) errorHandler(error)
    }
}
