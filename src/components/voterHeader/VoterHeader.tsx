import { Header } from 'antd/lib/layout/layout'
import React, { ReactElement } from 'react'
import { ReactComponent as AnovoteLogo } from 'style/assets/logo-icon.svg'
export default function VoterHeader({ slogan = '...' }: { slogan?: string }): ReactElement {
    return (
        <Header className="voter-header">
            <AnovoteLogo className={'header-logo'} />
            <span className="text-label">/</span>
            <span className="header-slogan">{slogan}</span>
        </Header>
    )
}
