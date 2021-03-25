import { EventExecutor } from './EventHandler'
import { IEventResponse } from './IEventResponse'

export interface IAsyncEmit<T> {
    socket: SocketIOClient.Socket
    event: string
    data?: unknown
    ack: EventExecutor<T>
    timeout?: number
}
/**
 * An async emit handler that will reject the ack callback after set timeout(default 10seconds).
 * If ack is returned from the server, the provided ack callback is executed
 * @returns promise
 */
export function AsyncEmit<T>({ socket, event, data, ack, timeout = 10000 }: IAsyncEmit<T>): Promise<unknown> {
    return new Promise<void>((resolve, reject) => {
        let rejected = false
        const timer = setTimeout(() => {
            rejected = true
            // trap the ack callback to be empty call in case emit returns after rejection
            ack = () => {
                return
            }
            reject(`${event} timed out`)
        }, timeout)

        socket.emit(event, data, (payload: IEventResponse<T> | T) => {
            ack(payload)
            if (!rejected) {
                // Stop the reject timer before we resolve
                clearTimeout(timer)
                resolve()
            }
        })
    })
}
