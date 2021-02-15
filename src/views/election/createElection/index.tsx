import { Content } from 'antd/lib/layout/layout'
import * as React from 'react'
import { Form, Input, Row, Col } from 'antd'

export default function CreateElectionView(): React.ReactElement {
    return (
        <Content>
            <Row>
                <Col span={12} className="election-information-input">
                    <h1>Create new election</h1>
                    <Form className="is-flex-column" layout="vertical" name="description-form">
                        <Form.Item>
                            <Input placeholder="Title"></Input>
                        </Form.Item>
                        <Form.Item>
                            <Input.TextArea placeholder="Description"></Input.TextArea>
                        </Form.Item>
                    </Form>
                    <h2>Schedule</h2>
                </Col>
            </Row>
        </Content>
    )
}
