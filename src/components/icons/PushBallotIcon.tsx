import { RocketOutlined } from '@ant-design/icons'
import React, { ReactElement } from 'react'
export default function PushBallotIcon({ spin = false }: { spin?: boolean }): ReactElement {
    return (
        <div className="circle-center-content main-contrasting push-ballot">
            <RocketOutlined spin={spin} />
        </div>
    )
}
