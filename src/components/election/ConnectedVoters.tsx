import { Card } from 'antd'
import Title from 'antd/lib/typography/Title'
import { Events } from 'core/events'
import { useSocket } from 'core/hooks/useSocket'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function ConnectedVoters(): ReactElement {
    const [connectedVoters, setConnectedVoters] = useState<number>(0)
    const [socket] = useSocket()
    const [t] = useTranslation('election')

    useEffect(() => {
        // todo fetch connected on refresh
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
        <Card className={'info-card'} title={<Title level={2}>{t('election:Connected voters')}</Title>}>
            <div className="is-flex-column has-content-center-center">
                <span className={'text-large'}>{connectedVoters}</span>
            </div>
        </Card>
    )
}
