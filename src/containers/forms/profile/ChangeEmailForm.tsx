import { Form, Input, Space } from 'antd'
import Button from 'antd/lib/button/button'
import { AlertList } from 'components/alert/AlertList'
import { BackendAPI } from 'core/api'
import { InvalidEmail } from 'core/errors/customErrors'
import { isValidEmail } from 'core/helpers/validation'
import { useAlert } from 'core/hooks/useAlert'
import { ElectionOrganizerService } from 'core/service/electionOrganizer/ElectionOrganizerService'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

export default function ChangeEmailForm(): ReactElement {
    const service = new ElectionOrganizerService(BackendAPI)
    const [t] = useTranslation(['translation', 'common', 'form', 'profile'])

    const [alertStates, dispatchAlert] = useAlert([{ message: '', level: undefined }])

    const submitForm = async ({ newEmail }: { newEmail: string }) => {
        try {
            await service.changeEmail(newEmail)
            dispatchAlert({
                type: 'add',
                level: 'success',
                message: t('profile:Email changed'),
                description: t('profile:Your email was changed'),
            })
        } catch (error) {
            if (error instanceof InvalidEmail) {
                dispatchAlert({
                    type: 'add',
                    level: 'error',
                    message: t('common:Something went wrong'),
                    description: `${t('common:Password')} ${t('form:Must match').toLocaleLowerCase()}`,
                })
            } else {
                dispatchAlert({
                    type: 'add',
                    level: 'error',
                    message: t('common:Something went wrong'),
                    description: t('common:Try again later'),
                })
            }
        }
    }

    return (
        <Space direction="vertical">
            <AlertList alerts={alertStates} />
            <Form onFinish={submitForm} layout={'horizontal'} name="change-email">
                <Space direction="horizontal" className="inline-form-item">
                    <Form.Item
                        name="newEmail"
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

                    <Button type="primary" htmlType="submit" className="">
                        {t('common:Save')}
                    </Button>
                </Space>
            </Form>
        </Space>
    )
}
