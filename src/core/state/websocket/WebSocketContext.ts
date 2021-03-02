import { AppConfig } from 'core/config'
import { createContext } from 'react'
import io from 'socket.io-client'

const socket = io(AppConfig.WS_URI, { autoConnect: false })

const WebSocketContext = createContext(socket)

export { socket, WebSocketContext }
