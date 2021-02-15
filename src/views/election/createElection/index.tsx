import { Content } from 'antd/lib/layout/layout'
import * as React from 'react'
import { Form, Input, Row, Col, DatePicker, TimePicker, Table, Space, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { eligibleVotersDummyData, electionAuthoritiesDummyData } from './DummyData'

export default function CreateElectionView(): React.ReactElement {
    const eligibleVotersColumns = [
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName',
        },
    ]

    const electionAuthoritiesColumns = [
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName',
        },
        {
            title: 'Organization',
            dataIndex: 'organization',
            key: 'organization',
        },
    ]

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
                    <Form className="is-flex-row" layout="horizontal" name="schedule-form">
                        <Row>
                            <Col span={12}>
                                <h3>Open</h3>
                                <Form.Item>
                                    <Space>
                                        <DatePicker />
                                        <TimePicker />
                                    </Space>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <h3>Close</h3>
                                <Form.Item>
                                    <Space>
                                        <DatePicker />
                                        <TimePicker />
                                    </Space>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <Row>
                        <Col span={12}>
                            <h2>Eligible voters</h2>
                        </Col>
                        <Col span={12}>
                            <Button
                                className="button"
                                type="primary"
                                shape="circle"
                                icon={<PlusOutlined />}
                                size="large"
                            />
                        </Col>
                    </Row>
                    <Table columns={eligibleVotersColumns} dataSource={eligibleVotersDummyData}></Table>
                    <Row>
                        <Col span={12}>
                            <h2>Election authorities</h2>
                        </Col>
                        <Col span={12}>
                            <Button
                                className="button"
                                type="primary"
                                shape="circle"
                                icon={<PlusOutlined />}
                                size="large"
                            />
                        </Col>
                    </Row>
                    <Table columns={electionAuthoritiesColumns} dataSource={electionAuthoritiesDummyData}></Table>
                </Col>
            </Row>
        </Content>
    )
}
