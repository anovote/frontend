import { Form, Input, Button, Divider, Alert } from 'antd'
import Layout, { Content } from 'antd/lib/layout/layout'
import React from 'react'

export default function ChangePassword(): React.ReactElement {
    const onabort = async () => {
        // TODO implement
        //throw new NotImplementedException()
    }

    const [errorMessage, setErrorMessage] = React.useState('')
    const [errorDescription, setErrorDescription] = React.useState('')
    const mediumRegex = new RegExp(
        '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})', // todo add comment
    )

    // typescript-eslint: disable no-explicit-any
    /* typescript-eslint-disable  no-explicit-any */
    const validateForm = async (values: ChangePasswordInterface) => {
        const { password1, password2 } = values
        if (password1 !== password2) {
            setErrorMessage('Passwords does not match')
            setErrorDescription('Please try again')
        }
    }

    return (
        <Layout className="layout">
            <Content className="is-fullscreen is-flex-column has-content-center-center">
                <h1>Change you password</h1>
                <div className="error-field">
                    {!!errorMessage && (
                        <Alert message={errorMessage} description={errorDescription} type={'error'} showIcon closable />
                    )}
                </div>
                <Form onAbort={onabort} onFinish={validateForm}>
                    <Form.Item
                        label="New password"
                        name="password1"
                        rules={[{ required: true, message: 'Please fill out', min: 8, pattern: mediumRegex }]}
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
interface ChangePasswordInterface {
    password1: string
    password2: string
}
