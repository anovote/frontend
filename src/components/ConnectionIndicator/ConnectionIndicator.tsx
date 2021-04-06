import { DisconnectOutlined, RocketOutlined } from '@ant-design/icons'
import { useSocket } from 'core/hooks/useSocket'
import React, { ReactElement } from 'react'

export default function ConnectionIndicator(): ReactElement {
    const [socket] = useSocket()

    let renderIndicator = <RocketOutlined />

    if (!socket.connected) {
        renderIndicator = <DisconnectOutlined />
    }

    return <div className="connection-indicator">{renderIndicator}</div>
}
