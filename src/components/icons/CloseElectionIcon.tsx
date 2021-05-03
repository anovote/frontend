import { CloseOutlined } from '@ant-design/icons'
import React, { ReactElement } from 'react'
export default function CloseElectionIcon(): ReactElement {
    return (
        <div className="danger-contrasting">
            <CloseOutlined style={{ color: 'white' }} />
        </div>
    )
}
