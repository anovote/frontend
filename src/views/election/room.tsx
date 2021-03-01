import React, { ReactElement } from 'react'
import { io } from 'socket.io-client'

export default function room(): ReactElement {
    const socket = io('ws://192.168.2.224:8877')

    socket.on('connect', () => {
        console.log('Connected!')

        console.log(socket)
    })
    socket.on('pong', () => {
        socket.send('pikk')
    })

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
