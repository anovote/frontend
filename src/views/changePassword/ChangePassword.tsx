import { Form, Input, Button, Divider, Alert, AlertProps } from 'antd'
import Layout, { Content } from 'antd/lib/layout/layout'
import React from 'react'
import { BackendAPI } from '../../core/api'
import { ElectionOrganizerService } from '../../core/service/electionOrganizer/ElectionOrganizerService'
import { PasswordDoesNotMatchError } from '../../core/models/customErrors'

export default function ChangePassword(): React.ReactElement {
    const onabort = async () => {
        // TODO implement
        //throw new NotImplementedException()
    }

    // todo change error to alert with configurations
    const [alertMessage, setAlertMessage] = React.useState('')
    const [alertDescription, setAlertDescription] = React.useState('')
    const [alertType, setAlertType] = React.useState<AlertProps['type']>(undefined)
    const service = new ElectionOrganizerService(BackendAPI)

    const submitForm = async (values: ChangePasswordInterface) => {
        try {
            await service.validateAndChangePassword(values)
            setAlertMessage('Password changed')
            setAlertDescription('Password was changed successfully')
            setAlertType('success')
        } catch (error) {
            setAlertType('error')
            if (error && error instanceof PasswordDoesNotMatchError) {
                setAlertMessage('Passwords does not match')
                setAlertDescription('Please try again')
            } else {
                setAlertMessage('Something went wrong')
                setAlertDescription('Please try again later')
            }
        }
    }

    return (
        <Layout className="layout">
            <Content className="is-fullscreen is-flex-column has-content-center-center">
                <h1>Change you password</h1>
                <div className="error-field">
                    {!!alertMessage && (
                        <Alert
                            message={alertMessage}
                            description={alertDescription}
                            type={alertType}
                            showIcon
                            closable
                        />
                    )}
                </div>
                <Form onAbort={onabort} onFinish={submitForm}>
                    <Form.Item
                        label="New password"
                        name="password1"
                        rules={[{ required: true, message: 'Please fill out', min: 8, pattern: service.strongRegex }]}
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
