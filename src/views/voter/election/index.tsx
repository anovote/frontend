import { LockOutlined } from '@ant-design/icons'
import { Divider } from 'antd'
import Layout, { Content, Footer } from 'antd/lib/layout/layout'
import SquareIconContainer from 'components/iconContainer/SquareIconContainer'
import VoterHeader from 'components/voterHeader/VoterHeader'
import VoterTopInfo from 'components/voterContentInfo/VoterContentInfo'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import VoterFooter from 'components/voterFooter/VoterFooter'
export default function VoterElectionView(): ReactElement {
    const [t] = useTranslation(['election'])
    return (
        <Layout className="small-container">
            <VoterHeader />
            <Content className="layout-content">
                <VoterTopInfo title="Title" context="some context" />
                <Divider />
                <div className="election-main">
                    <SquareIconContainer
                        icon={<LockOutlined className="wobble-animation" />}
                        label={t('election:Election opens', { date: new Date().toLocaleDateString() })}
                    />
                </div>
            </Content>
            <VoterFooter />
        </Layout>
    )
}
