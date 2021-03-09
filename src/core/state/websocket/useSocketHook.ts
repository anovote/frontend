import { useContext } from 'react'
import { AnoSocket } from './IAnoSocket'
import { WebSocketContext } from './WebSocketContext'

/**
 * A hook to fetch the socket.io instance
 * @param token the token that identifies a logged in user
 */
const useSocket = (): [AnoSocket] => {
    const socket = useContext(WebSocketContext) as AnoSocket

    return [socket]
}

export { useSocket }
