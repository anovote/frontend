import { Card } from 'antd'
import Layout, { Content } from 'antd/lib/layout/layout'
import React from 'react'

/**
 * A 404 component to be shown if no route matches
 */
function NotFound(): React.ReactElement {
    return (
        <Layout className="layout">
            <Content className="is-fullscreen is-flex-column has-content-center-center">
                <Card title="404 - Not found">
                    <p>Probably a Windows error...</p>
                </Card>
            </Content>
        </Layout>
    )
}

export default NotFound
