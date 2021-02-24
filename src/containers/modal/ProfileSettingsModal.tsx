import { Col, Form, Input, Row, Space } from 'antd'
import Button from 'antd/lib/button/button'
import Modal from 'antd/lib/modal/Modal'
import Title from 'antd/lib/typography/Title'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ProfileSettingsModal() {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [t] = useTranslation(['translation', 'common', 'form'])

    const showModal = () => {
        setIsModalVisible(true)
    }

    const handleOk = () => {
        setIsModalVisible(false)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    function one() {
        console.log('hei')
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
                className="modal-display-small"
            >
                <Row>
                    <Col span={24}>
                        <Title level={2}></Title>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Title level={3}>Update email</Title>
                        <Form onFinish={one} layout={'horizontal'} name="basic" initialValues={{ remember: true }}>
                            <Space direction="horizontal" className="inline-form-item">
                                <Form.Item
                                    name="username"
                                    rules={[
                                        {
                                            required: true,
                                            message: t('form:Must contain special character', { count: 2 }),
                                        },
                                    ]}
                                >
                                    <Input style={{ width: 250 }} placeholder="Please input" />
                                </Form.Item>

                                <Button type="primary" htmlType="submit" className="main-light is-rounded">
                                    Submit
                                </Button>
                            </Space>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Title level={3}>Change password</Title>
                        <Form layout={'vertical'}>
                            <Space direction="vertical">
                                <Form.Item
                                    name="username"
                                    rules={[{ required: true, message: 'Username is required' }]}
                                >
                                    <Input.Password style={{ width: 250 }} placeholder="Please input" />
                                </Form.Item>
                                <Space className="inline-form-item">
                                    <Form.Item
                                        name="username"
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
