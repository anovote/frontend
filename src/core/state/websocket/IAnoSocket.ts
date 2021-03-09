export interface AnoSocket extends SocketIOClient.Socket {
    auth: {
        token: string
    }
}
