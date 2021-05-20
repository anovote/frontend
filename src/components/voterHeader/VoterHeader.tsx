import { Header } from 'antd/lib/layout/layout'
import ConnectionIndicator from 'components/ConnectionIndicator/ConnectionIndicator'
import React, { ReactElement } from 'react'
import { ReactComponent as AnovoteLogo } from 'style/assets/anovote-logo.svg'
export default function VoterHeader(): ReactElement {
    return (
        <Header className="voter-election-header">
            <AnovoteLogo className={'voter-header-logo'} />
            <ConnectionIndicator />
        </Header>
    )
}
