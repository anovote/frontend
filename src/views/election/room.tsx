import { Events } from 'core/events'
import { useSocket } from 'core/hooks/useSocket'
import React, { ReactElement, useEffect } from 'react'

export default function Room(): ReactElement {
    const [socket] = useSocket()
    socket.connect()

    useEffect(() => {
        socket.on(Events.standard.socket.connect, () => {
            console.log('Connected!')

            console.log(socket.id)
        })

        socket.on(Events.standard.socket.disconnect, () => {
            console.log('disconnected')
        })
        socket.on(Events.standard.message, (data: string) => {
            console.log(data)
        })

        socket.on(Events.standard.socket.connectError, () => {
            console.log('connect-error')
        })

        return () => {
            socket.close()
        }
    }, [socket])

    return (
        <div>
            <button
                onClick={() => {
                    socket.emit('ping', 'come on!')
                    console.log('send')
                }}
            >
                Ping
            </button>
        </div>
    )
}
