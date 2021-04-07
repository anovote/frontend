import { DisconnectOutlined, RocketOutlined } from '@ant-design/icons'
import { Popover } from 'antd'
import { useSocket } from 'core/hooks/useSocket'
import React, { ReactElement } from 'react'
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

    let renderIndicator = (
        <>
            <Popover placement="bottomRight" content={disconnectedContent} title={t('common:Disconnected')}>
                <DisconnectOutlined />
            </Popover>
        </>
    )

    if (socket.connected) {
        renderIndicator = (
            <>
                <Popover placement="bottomRight" content={connectedContent} title={t('common:Connected')}>
                    <RocketOutlined />
                </Popover>
            </>
        )
    }

    return <div className="connection-indicator">{renderIndicator}</div>
}
