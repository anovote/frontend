import { Checkbox, Col, Form, Input, Layout, Pagination, Row, Space, Tooltip } from 'antd'
import Button from 'antd/lib/button/button'
import { Content, Footer, Header } from 'antd/lib/layout/layout'
import Sider from 'antd/lib/layout/Sider'
import Modal from 'antd/lib/modal/Modal'
import Title from 'antd/lib/typography/Title'
import React, { useState } from 'react'
import LoginView from '../../views/login'
export const AnoModal = () => {
    const [isModalVisible, setIsModalVisible] = useState(false)

    const showModal = () => {
        setIsModalVisible(true)
    }

    const handleOk = () => {
        setIsModalVisible(false)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Open Modal
            </Button>
            <Modal
                width={'100vw'}
                title={'Update profile'}
                footer={null}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Row>
                    <Col span={24}>
                        <Title level={2}>Christoffer Traeen</Title>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Title level={3}>Update email</Title>
                        <Form layout={'vertical'} name="basic" initialValues={{ remember: true }}>
                            <Space>
                                <Form.Item
                                    name="username"
                                    noStyle
                                    rules={[{ required: true, message: 'Username is required' }]}
                                >
                                    <Input style={{ width: 250 }} placeholder="Please input" />
                                </Form.Item>

                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Space>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Title level={3}>Change password</Title>
                        <Form layout={'vertical'} name="basic" initialValues={{ remember: true }}>
                            <Space direction="vertical">
                                <Form.Item
                                    name="username"
                                    noStyle
                                    rules={[{ required: true, message: 'Username is required' }]}
                                >
                                    <Input.Password style={{ width: 250 }} placeholder="Please input" />
                                </Form.Item>
                                <Space>
                                    <Form.Item
                                        name="username"
                                        noStyle
                                        rules={[{ required: true, message: 'Username is required' }]}
                                    >
                                        <Input.Password style={{ width: 250 }} placeholder="Please input" />
                                    </Form.Item>

                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Space>
                            </Space>
                        </Form>
                    </Col>
                </Row>
            </Modal>
        </>
    )
}
