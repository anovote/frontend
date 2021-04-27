import { Col, Row } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import Title from 'antd/lib/typography/Title'
import ChangeEmailFrom from 'containers/forms/profile/ChangeEmailForm'
import ChangePasswordForm from 'containers/forms/profile/ChangePasswordForm'
import { IElectionOrganizerEntity } from 'core/models/electionOrganizer/IElectionOrganizerEntity'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { LogoutButton } from './LogoutButton'

export default function ProfileSettingsModal({
    organizer,
    showModal,
    close,
}: {
    organizer: IElectionOrganizerEntity
    showModal: boolean
    close: () => void
}): ReactElement {
    const [t] = useTranslation(['translation', 'common', 'form', 'profile'])

    const { firstName, lastName } = organizer

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
                        <Title level={2}>
                            {firstName} {lastName}
                        </Title>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Title level={3}>{t('profile:Change email')}</Title>
                        <ChangeEmailFrom initialValue={organizer} />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Title level={3}>{t('profile:Change password')}</Title>
                        <ChangePasswordForm initialValue={organizer} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <LogoutButton />
                    </Col>
                </Row>
            </Modal>
        </>
    )
}
