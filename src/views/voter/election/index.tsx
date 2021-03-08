import { LockOutlined } from '@ant-design/icons'
import { Divider } from 'antd'
import Layout, { Content, Footer, Header } from 'antd/lib/layout/layout'
import SquareIconContainer from 'components/iconContainer/SquareIconContainer'
import VoterHeader from 'components/voterHeader/VoterHeader'
import React from 'react'
export default function VoterElectionView() {
    return (
        <Layout className="small-container">
            <Header className="voter-header">
                <VoterHeader />
            </Header>
            <Content className="layout-content">
                <div className="election-top">
                    <span className="text-label">New board members 2021</span>
                    <span className="text-medium">Test title</span>
                </div>
                <Divider></Divider>
                <div className="election-main">
                    <SquareIconContainer
                        icon={<LockOutlined className="wobble-animation" />}
                        label={'election is locked'}
                    />
                </div>
            </Content>
            <Footer>Anovote 2021</Footer>
        </Layout>
    )
}
