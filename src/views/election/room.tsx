import { AppConfig } from 'core/config'
import React, { ReactElement, useEffect } from 'react'
import useSocket from 'use-socket.io-client'

export default function room(): ReactElement {
    let socket: any
    useEffect(() => {
        //socket = io(AppConfig.WS_URI).connect()
        const [socket] = useSocket(AppConfig.WS_URI)
        socket.connect()
        socket.auth = {
            token:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwib3JnYW5pemVyIjp0cnVlLCJpYXQiOjE2MTQ2MzQ3MjYsImV4cCI6MTYxNDgwNzUyNn0.IF3gVy7mY2ffXZsHF6-isZ09QYJggdZuIogZotl8Jqk',
        }
        socket.on('connect', () => {
            console.log('Connected!')

            console.log(socket.io)
        })

        socket.on('disconnect', (data: any) => {
            console.log('disconnected', data)
        })

        socket.on('connect_error', (data: any) => {
            console.log('connect-error', data)
        })
    }, [])

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
