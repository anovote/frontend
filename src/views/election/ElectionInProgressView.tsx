import Layout from 'antd/lib/layout/layout'
import Sider from 'antd/lib/layout/Sider'
import React, { ReactElement } from 'react'
import ElectionView from './election'

export function ElectionInProgressView(): ReactElement {
    return (
        <Layout>
            <Sider>{/*<ElectionView />*/}</Sider>
        </Layout>
    )
}
