import { Button, Form, Input, Space } from 'antd'
import { AlertList } from 'components/alert/AlertList'
import { BackendAPI } from 'core/api'
import { PasswordDoesNotMatchError } from 'core/errors/customErrors'
import { useAlert } from 'core/hooks/useAlert'
import { IElectionOrganizerEntity } from 'core/models/electionOrganizer/IElectionOrganizerEntity'
import { ElectionOrganizerService } from 'core/service/electionOrganizer/ElectionOrganizerService'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function ChangePasswordForm({
    initialValue,
}: {
    initialValue: IElectionOrganizerEntity
}): React.ReactElement {
    const service = new ElectionOrganizerService(BackendAPI)
    const [t] = useTranslation(['translation', 'common', 'form', 'profile'])

    const { alertStates, dispatchAlert } = useAlert([{ message: '', level: undefined }])

    const submitForm = async (passwords: { password1: string; password2: string }) => {
        try {
            await service.changePassword(initialValue, passwords)
            dispatchAlert({
                type: 'add',
                level: 'success',
                message: 'Password changed',
                description: 'Your password was changed',
            })
        } catch (error) {
            if (error instanceof PasswordDoesNotMatchError) {
                dispatchAlert({
                    type: 'add',
                    level: 'error',
                    message: 'Something went wrong',
                    description: `${t('common:Password')} ${t('form:Must match').toLocaleLowerCase()}`,
                })
            } else {
                dispatchAlert({
                    type: 'add',
                    level: 'error',
                    message: 'Something went wrong',
                    description: t('common:Try again later'),
                })
            }
        }
    }

    return (
        <>
            <Space direction="vertical">
                <AlertList alerts={alertStates} onRemove={(index) => dispatchAlert({ type: 'remove', index: index })} />
                <Form layout={'vertical'} onFinish={submitForm}>
                    <Space direction="vertical">
                        <Form.Item
                            name="password1"
                            rules={[
                                { required: true, message: t('form:Is required') },
                                {
                                    min: 8,
                                    message: t('form:Password validation'),
                                    pattern: service.strongRegex,
                                },
                            ]}
                        >
                            <Input.Password style={{ width: 250 }} placeholder={t('common:New password')} />
                        </Form.Item>
                        <Space className="inline-form-item">
                            <Form.Item
                                name="password2"
                                rules={[
                                    { required: true, message: t('form:Is required') },

                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password1') === value) {
                                                return Promise.resolve()
                                            }
                                            return Promise.reject(
                                                t('form:Must be equal', {
                                                    field: t('common:New password').toLowerCase(),
                                                }),
                                            )
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password style={{ width: 250 }} placeholder={t('common:Retype new password')} />
                            </Form.Item>

                            <Button type="primary" htmlType="submit">
                                {t('common:Save')}
                            </Button>
                        </Space>
                    </Space>
                </Form>
            </Space>
        </>
    )
}
