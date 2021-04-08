import { DisconnectOutlined, RocketOutlined } from '@ant-design/icons'
import { Popover } from 'antd'
import { Events } from 'core/events'
import { useSocket } from 'core/hooks/useSocket'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ConnectionIndicator(): ReactElement {
    const [socket] = useSocket()
    const [t] = useTranslation(['socket', 'common'])
    const disconnectedContent = (
        <div>
            <p>{t('socket:Attempting to reconnect')}..</p>
        </div>
    )
    const connectedContent = (
        <div>
            <p>{t('socket:Stable connection to socket')}</p>
        </div>
    )

    const disconnectedElement = (
        <>
            <Popover placement="bottomRight" content={disconnectedContent} title={t('common:Disconnected')}>
                <DisconnectOutlined />
            </Popover>
        </>
    )
    const connectedElement = (
        <>
            <Popover placement="bottomRight" content={connectedContent} title={t('common:Connected')}>
                <RocketOutlined />
            </Popover>
        </>
    )
    const [renderIndicator, setRenderIndicator] = useState(disconnectedElement)

    useEffect(() => {
        socket.on(Events.standard.socket.connect, () => {
            setRenderIndicator(connectedElement)
        })

        socket.on(Events.standard.socket.disconnect, () => {
            setRenderIndicator(disconnectedElement)
        })
    }, [socket])

    return <div className="connection-indicator">{renderIndicator}</div>
}
