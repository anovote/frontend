import React, { ReactElement } from 'react'
import { socket, WebSocketContext } from './WebSocketContext'

/**
 * The manager handles the web socket context for all react element children
 * @param { children } react element to pass inside the manager
 */
export default function WebSocketManager({ children }: { children: ReactElement }): ReactElement {
    return <WebSocketContext.Provider value={socket}>{children}</WebSocketContext.Provider>
}
