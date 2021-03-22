import { AlertProps, Button, Col, Row } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import Title from 'antd/lib/typography/Title'
import ChangeEmailFrom from 'containers/forms/profile/ChangeEmailForm'
import ChangePasswordForm from 'containers/forms/profile/ChangePasswordForm'
import { BackendAPI } from 'core/api'
import { getPublicRoute } from 'core/routes/siteRoutes'
import { AuthenticationService } from 'core/service/authentication/AuthenticationService'
import { LocalStorageService } from 'core/service/storage/LocalStorageService'
import { AlertState } from 'core/state/AlertState'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'

export default function ProfileSettingsModal({
    showModal,
    close,
}: {
    showModal: boolean
    close: () => void
}): ReactElement {
    const [t] = useTranslation(['translation', 'common', 'form', 'profile'])
    const history = useHistory<AlertState>()

    const logoutHandler = () => {
        console.log('here')
        new AuthenticationService(BackendAPI, new LocalStorageService()).logout()
        const alert: AlertProps = { message: 'You where logged out', closable: true, type: 'info', showIcon: true }
        history.push(getPublicRoute().login, { alertProps: alert })
    }

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
                <Row>
                    <Col>
                        <Button className="logout-btn" onClick={logoutHandler}>
                            {t('common:Log out')}
                        </Button>
                    </Col>
                </Row>
            </Modal>
        </>
    )
}
