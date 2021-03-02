import { Events } from 'core/events'
import { useSocket } from 'core/state/websocket/useSocketHook'
import React, { ReactElement, useEffect } from 'react'

export default function room(): ReactElement {
    const [socket] = useSocket(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwib3JnYW5pemVyIjp0cnVlLCJpYXQiOjE2MTQ2OTQzMTcsImV4cCI6MTYxNDg2NzExN30.In727cRSJTAhRZtf5i0-XgECAi2awFH4JYjI3kty_m4',
    )
    socket.connect()

    useEffect(() => {
        socket.on(Events.standard.socket.connect, () => {
            console.log('Connected!')

            console.log(socket.id)
        })

        socket.on(Events.standard.socket.disconnect, (data: any) => {
            console.log('disconnected', data)
        })
        socket.on(Events.standard.message, (data: any) => {
            console.log(data)
        })

        socket.on(Events.standard.socket.connectError, (data: any) => {
            console.log('connect-error', data)
        })

        return () => {
            console.log('destroy')
        }
    }, [socket])

    return (
        <div>
            <button
                onClick={() => {
                    socket.emit('ping', 'pikk!')
                    console.log('send')
                }}
            >
                Ping
            </button>
        </div>
    )
}
