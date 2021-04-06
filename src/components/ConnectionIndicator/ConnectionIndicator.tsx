import { DisconnectOutlined, RocketFilled, RocketOutlined, WarningFilled } from '@ant-design/icons'
import { Events } from 'core/events'
import { useSocket } from 'core/hooks/useSocket'
import React, { ReactElement, useEffect, useState } from 'react'

export default function ConnectionIndicator(): ReactElement {
    const [socket] = useSocket()

    let renderIndicator = <DisconnectOutlined />

    if (socket.connected) {
        renderIndicator = <RocketOutlined />
    }

    return <div className="connection-indicator">{renderIndicator}</div>
}
