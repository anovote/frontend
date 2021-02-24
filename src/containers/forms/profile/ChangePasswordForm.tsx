import { Space, Form, Input, Button, Divider, Alert, AlertProps } from 'antd'

import React from 'react'
import { BackendAPI } from 'core/api'
import { ElectionOrganizerService } from 'core/service/electionOrganizer/ElectionOrganizerService'
import { PasswordDoesNotMatchError } from 'core/models/customErrors'
import { useTranslation } from 'react-i18next'

export default function ChangePasswordForm(): React.ReactElement {
    const [alertProps, setAlertProps] = React.useState<AlertProps>()
    const service = new ElectionOrganizerService(BackendAPI)

    const [t] = useTranslation(['translation', 'common', 'form', 'profile'])
    const submitForm = async (values: ChangePasswordInterface) => {
        try {
            await service.validateAndChangePassword(values)
            const newAlertProps: AlertProps = {
                message: 'Password changed',
                description: 'Password was changed successfully',
                type: 'success',
            }
            setAlertProps(newAlertProps)
        } catch (error) {
            const newAlertProps: AlertProps = {
                message: '',
                type: 'error',
            }
            if (error && error instanceof PasswordDoesNotMatchError) {
                newAlertProps.message = 'Passwords does not match'
                newAlertProps.description = 'Please try again'
            } else {
                newAlertProps.message = 'Something went wrong'
                newAlertProps.description = 'Please try again later'
            }
            setAlertProps(newAlertProps)
        }
    }

    return (
        <>
            <div className="error-field">
                {!!alertProps && (
                    <Alert
                        message={alertProps?.message}
                        description={alertProps?.description}
                        type={alertProps?.type}
                        showIcon
                        closable
                    />
                )}
            </div>
            <Form layout={'vertical'} onFinish={submitForm}>
                <Space direction="vertical">
                    <Form.Item
                        name="new-password"
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
                        <Form.Item name="re-new-password" rules={[{ required: true, message: t('form:Is required') }]}>
                            <Input.Password style={{ width: 250 }} placeholder={t('common:Retype new password')} />
                        </Form.Item>

                        <Button type="primary" htmlType="submit">
                            {t('common:Save')}
                        </Button>
                    </Space>
                </Space>
            </Form>
        </>
    )
}
// todo if password1 is visible don't show password2
export interface ChangePasswordInterface {
    password1: string
    password2: string
}
