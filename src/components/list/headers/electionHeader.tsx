import { PlusOutlined } from '@ant-design/icons'
import { Button, Col, Row, Space } from 'antd'
import Title from 'antd/lib/typography/Title'
import { ElectionStatus } from 'core/models/election/ElectionStatus'
import { getAdminRoute } from 'core/routes/siteRoutes'
import React, { ReactElement } from 'react'
import { useHistory } from 'react-router-dom'

export default function ElectionHeader({
    status,
    title,
    count,
}: {
    status: ElectionStatus
    title: string
    count: number | undefined
}): ReactElement {
    const history = useHistory()

    /**
     * Redirect to create election
     */
    const addNewElection = () => {
        history.push(getAdminRoute().elections.create)
    }

    let info = (
        <Space className="col-position" align="center">
            <Button id="card-add-btn" onClick={addNewElection} type="primary" icon={<PlusOutlined />} size="small" />
            <span className="card-total-count">{count}</span>
        </Space>
    )
    if (status == ElectionStatus.Finished) {
        info = (
            <Space className="col-position" align="center">
                <span className="card-total-count">{count}</span>
            </Space>
        )
    }

    return (
        <Row justify="space-between" align="top">
            <Col span={12}>
                <Title level={3}>{title}</Title>
            </Col>
            <Col span={6} id="header-info">
                {info}
            </Col>
        </Row>
    )
}
