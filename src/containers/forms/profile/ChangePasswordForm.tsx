import { Alert, AlertProps, Button, Form, Input, Space } from 'antd'
import { BackendAPI } from 'core/api'
import { PasswordDoesNotMatchError } from 'core/models/customErrors'
import { ElectionOrganizerService } from 'core/service/electionOrganizer/ElectionOrganizerService'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function ChangePasswordForm(): React.ReactElement {
    const [alertProps, setAlertProps] = React.useState<AlertProps>()
    const service = new ElectionOrganizerService(BackendAPI)
    const [t] = useTranslation(['translation', 'common', 'form', 'profile'])

    const submitForm = async (values: ChangePasswordInterface) => {
        try {
            await service.validateAndChangePassword(values)
            const newAlertProps: AlertProps = {
                message: t('profile:Password changed'),
                description: t('profile:Your password changed'),
                type: 'success',
            }
            setAlertProps(newAlertProps)
        } catch (error) {
            const newAlertProps: AlertProps = {
                message: t('common:Something went wrong'),
                type: 'error',
            }
            if (error instanceof PasswordDoesNotMatchError) {
                newAlertProps.description = `${t('common:Password')} ${t('form:Must match').toLocaleLowerCase()}`
            } else {
                newAlertProps.description = t('common:Try again later')
            }
            setAlertProps(newAlertProps)
        }
    }

    return (
        <>
            <Space direction="vertical">
                {!!alertProps && (
                    <Alert
                        message={alertProps?.message}
                        description={alertProps?.description}
                        type={alertProps?.type}
                        onClose={() => {
                            setAlertProps(undefined)
                        }}
                        showIcon
                        closable
                    />
                )}
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
// todo if password1 is visible don't show password2
export interface ChangePasswordInterface {
    password1: string
    password2: string
}
