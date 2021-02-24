import { Form, Input, Button, Divider, Alert, AlertProps } from 'antd'
import Layout, { Content } from 'antd/lib/layout/layout'
import React from 'react'
import { BackendAPI } from 'core/api'
import { ElectionOrganizerService } from 'core/service/electionOrganizer/ElectionOrganizerService'
import { PasswordDoesNotMatchError } from 'core/models/customErrors'

export default function ChangePassword(): React.ReactElement {
    const onabort = async () => {
        // TODO implement
        //throw new NotImplementedException()
    }

    const [alertProps, setAlertProps] = React.useState<AlertProps>()
    const service = new ElectionOrganizerService(BackendAPI)

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
        <Layout className="layout">
            <Content className="is-fullscreen is-flex-column has-content-center-center">
                <h1>Change you password</h1>
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
                <Form onAbort={onabort} onFinish={submitForm}>
                    <Form.Item
                        label="New password"
                        name="password1"
                        rules={[
                            { required: true, message: 'Please fill out' },
                            {
                                min: 8,
                                message: 'Minimum 8 characters, one uppercase, one numeric and one special',
                                pattern: service.strongRegex,
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="Re-type password"
                        name="password2"
                        rules={[{ required: true, message: 'Please fill out' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Change password
                        </Button>
                        <Divider type="vertical" />
                        <Button type="default" htmlType="reset">
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Content>
        </Layout>
    )
}
// todo if password1 is visible don't show password2
export interface ChangePasswordInterface {
    password1: string
    password2: string
}
