import Layout from 'antd/lib/layout/layout'
import * as React from 'react'
import { Content } from 'antd/lib/layout/layout'

export default function RegisterView(): React.ReactElement {
    return (
        <Layout className="layout">
            <Content className="is-fullscreen is-flex-colum has-content-center-center">
                <h1>ANOVOTE</h1>
            </Content>
        </Layout>
    )
}
