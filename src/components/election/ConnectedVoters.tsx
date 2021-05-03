import { Card } from 'antd'
import { Events } from 'core/events'
import { useSocket } from 'core/hooks/useSocket'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function ConnectedVoters(): ReactElement {
    const [connectedVoters, setConnectedVoters] = useState<number>(0)
    const [socket] = useSocket()
    const [t] = useTranslation('election')

    useEffect(() => {
        // todo #203 add how many voters that could be connected
        socket.connect()
        socket.on(Events.server.election.voterConnected, (connectedCount: number) => {
            setConnectedVoters(connectedCount)
        })

        socket.on(Events.server.election.voterDisconnected, (connectedCount: number) => {
            setConnectedVoters(connectedCount)
        })
        return () => {
            socket.disconnect()
        }
    }, [])

    return (
        <Card
            className={'info-card'}
            title={<span className="text-paragraph-title">{t('election:Connected voters')}</span>}
        >
            <div className="is-flex-column has-content-center-center">
                <span className={'text-large'}>{connectedVoters}</span>
            </div>
        </Card>
    )
}
