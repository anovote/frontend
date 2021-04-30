import { Form, Input, Space } from 'antd'
import Button from 'antd/lib/button/button'
import { AlertList } from 'components/alert/AlertList'
import { BackendAPI } from 'core/api'
import { InvalidEmail } from 'core/errors/customErrors'
import { isValidEmail } from 'core/helpers/validation'
import { useAlert } from 'core/hooks/useAlert'
import { IElectionOrganizerEntity } from 'core/models/electionOrganizer/IElectionOrganizerEntity'
import { ElectionOrganizerService } from 'core/service/electionOrganizer/ElectionOrganizerService'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ChangeEmailForm({ initialValue }: { initialValue: IElectionOrganizerEntity }): ReactElement {
    const service = new ElectionOrganizerService(BackendAPI)
    const [t] = useTranslation(['translation', 'common', 'form', 'profile'])
    const [isLoading, setIsLoading] = useState(false)

    const { alertStates, dispatchAlert } = useAlert([{ message: '', level: undefined }])

    const submitForm = async ({ email }: { email: string }) => {
        setIsLoading(true)
        const organizer = initialValue
        organizer.email = email
        try {
            await service.changeEmail(organizer)
            setTimeout(() => {
                setIsLoading(false)
                dispatchAlert({
                    type: 'add',
                    level: 'success',
                    message: t('profile:Email changed'),
                    description: t('profile:Your email was changed'),
                })
            }, 1000)
        } catch (error) {
            setIsLoading(false)
            if (error instanceof InvalidEmail) {
                dispatchAlert({
                    type: 'add',
                    level: 'error',
                    message: t('common:Email is invalid'),
                    description: t('common:Try again later'),
                })
            } else {
                dispatchAlert({
                    type: 'add',
                    level: 'error',
                    message: t('common:Your request to change email was not fulfilled'),
                    description: `${t('profile:Email is already in use').toLocaleLowerCase()}`,
                })
            }
        }
    }

    return (
        <Space direction="vertical">
            <AlertList alerts={alertStates} onRemove={(index) => dispatchAlert({ type: 'remove', index: index })} />
            <Form onFinish={submitForm} layout={'horizontal'} name="change-email" initialValues={initialValue}>
                <Space direction="horizontal" className="inline-form-item">
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: t('form:Is required'),
                            },
                            {
                                validator: (_, value) => {
                                    if (!value) return Promise.reject()
                                    if (isValidEmail(value)) {
                                        return Promise.resolve()
                                    }
                                    return Promise.reject(t('form:Email is not valid'))
                                },
                            },
                        ]}
                    >
                        <Input style={{ width: 250 }} placeholder={t('common:Email')} />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        {t('common:Save')}
                    </Button>
                </Space>
            </Form>
        </Space>
    )
}
