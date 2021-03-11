/**
 * Maps all events to a key value pair.
 */
export const Events = {
    standard: {
        message: 'message',
        socket: {
            connect: 'connect',
            disconnect: 'disconnect',
            connectError: 'connect_error',
            confirmReceivedJoin: 'confirmReceivedJoin',
        },
        manager: {
            reconnect: {
                e: 'reconnect',
                attempt: 'reconnect_attempt',
                error: 'reconnect_error',
                failed: 'reconnect_failed',
            },
            error: 'error',
            ping: 'ping',
        },
    },
    voter: {
        close: 'close',
        election: 'election',
        ballot: 'ballot',
        result: 'result',
    },
}
