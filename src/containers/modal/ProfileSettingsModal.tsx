import { Col, Row } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import Title from 'antd/lib/typography/Title'
import ChangeEmailFrom from 'containers/forms/profile/ChangeEmailForm'
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
                        <ChangeEmailFrom />
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
