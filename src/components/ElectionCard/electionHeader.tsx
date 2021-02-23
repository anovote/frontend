import { Button, Col, Row, Space } from 'antd'
import Title from 'antd/lib/typography/Title'
import React, { ReactElement } from 'react'
import { PlusOutlined } from '@ant-design/icons'

export default function ElectionHeader({ title, count }: { title: string; count: number }): ReactElement {
    return (
        <>
            <Row justify="space-between" align="top">
                <Col span={12}>
                    <Title level={3}>{title}</Title>
                </Col>
                <Col span={6} id="header-info">
                    <Space className="col-position" align="center">
                        <Button id="card-add-btn" type="primary" icon={<PlusOutlined />} size="small" />
                        <span className="card-total-count">{count}</span>
                    </Space>
                </Col>
            </Row>
        </>
    )
}
