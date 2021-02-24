import { Alert, AlertProps, Button, Form, Input, Space } from 'antd'
import { BackendAPI } from 'core/api'
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
                description: t('common:Try again later'),
                type: 'error',
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
                        onClose={() => {
                            setAlertProps(undefined)
                        }}
                        showIcon
                        closable
                    />
                )}
            </div>
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
                                            t('form:Must be equal', { field: t('common:New password').toLowerCase() }),
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
        </>
    )
}
// todo if password1 is visible don't show password2
export interface ChangePasswordInterface {
    password1: string
    password2: string
}
