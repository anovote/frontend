import BallotsQueue from 'components/queue/BallotsQueue'
import { useSocket } from 'core/state/websocket/useSocketHook'
import { freshBallots } from 'dummy/ballotsDummyData'
import React, { ReactElement, useEffect } from 'react'

export function ElectionInProgressView(): ReactElement {
    const [socket] = useSocket()

    useEffect(() => {
        socket.connect()

        socket.on('connection', () => {
            console.log(socket.id)
        })
        return () => {
            socket.disconnect()
        }
    }, [socket])

    return <BallotsQueue dataSource={freshBallots} />
}
