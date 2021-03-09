import { LockOutlined } from '@ant-design/icons'
import { Divider } from 'antd'
import Layout, { Content } from 'antd/lib/layout/layout'
import SquareIconContainer from 'components/iconContainer/SquareIconContainer'
import VoterContent from 'components/voterContent/VoterContent'
import VoterTopInfo from 'components/voterContentInfo/VoterContentInfo'
import VoterFooter from 'components/voterFooter/VoterFooter'
import VoterHeader from 'components/voterHeader/VoterHeader'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
export default function VoterElectionView(): ReactElement {
    const [t] = useTranslation(['election'])

    return (
        <Layout className="small-container">
            <VoterHeader slogan="Anovote" />
            <Content className="layout-content">
                <VoterTopInfo title="Title" context="some context" />
                <Divider />
                <VoterContent>
                    <SquareIconContainer
                        icon={<LockOutlined className="wobble-animation" />}
                        label={t('election:Election opens', { date: new Date().toLocaleDateString() })}
                    />
                </VoterContent>
            </Content>
            <VoterFooter />
        </Layout>
    )
}
