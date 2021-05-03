export interface AnoSocket extends SocketIOClient.Socket {
    auth: {
        authenticated: boolean
    }
}
