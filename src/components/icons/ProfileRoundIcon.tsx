import React, { ReactElement } from 'react'
import { UserOutlined } from '@ant-design/icons'
export default function ProfileRoundIcon(): ReactElement {
    return (
        <div className="circle-center-content main-contrasting">
            <UserOutlined className="user-icon" />
        </div>
    )
}
