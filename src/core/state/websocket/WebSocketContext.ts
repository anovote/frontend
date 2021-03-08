import { AppConfig } from 'core/config'
import { createContext } from 'react'
import io from 'socket.io-client'
import { AnoSocket } from './IAnoSocket'

const socket = io(AppConfig.WS_URI, { autoConnect: false }) as AnoSocket

// get token of logged in user
const token = localStorage.getItem('ACCESS_TOKEN')

socket.auth = {
    token: `Bearer ${token}`,
}

// generate context with attached logged in user to auth
const WebSocketContext = createContext(socket)

export { socket, WebSocketContext }
