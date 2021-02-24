import { Col, Form, Input, Row, Space } from 'antd'
import Button from 'antd/lib/button/button'
import Modal from 'antd/lib/modal/Modal'
import Title from 'antd/lib/typography/Title'
import ChangePasswordForm from 'containers/forms/profile/ChangePasswordForm'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

export default function ProfileSettingsModal({
    showModal,
    close,
}: {
    showModal: boolean
    close: () => void
}): ReactElement {
    const [t] = useTranslation(['translation', 'common', 'form', 'profile'])

    return (
        <>
            <Modal
                width={'100vw'}
                title={t('profile:Update profile')}
                footer={null}
                visible={showModal}
                onCancel={close}
                className="modal-display-small"
            >
                <Row>
                    <Col span={24}>
                        <Title level={2}>Name of person</Title>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Title level={3}>{t('profile:Change email')}</Title>
                        <Form onFinish={one} layout={'horizontal'} name="basic">
                            <Space direction="horizontal" className="inline-form-item">
                                <Form.Item
                                    name="username"
                                    rules={[
                                        {
                                            required: true,
                                            message: t('form:Is required'),
                                        },
                                    ]}
                                >
                                    <Input style={{ width: 250 }} placeholder={t('common:Email')} />
                                </Form.Item>

                                <Button type="primary" htmlType="submit" className="">
                                    {t('common:Save')}
                                </Button>
                            </Space>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Title level={3}>{t('profile:Change password')}</Title>
                        <ChangePasswordForm />
                    </Col>
                </Row>
            </Modal>
        </>
    )
}
