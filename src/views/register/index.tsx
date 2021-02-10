import { Button, Form, Input } from 'antd'
import Layout, { Content } from 'antd/lib/layout/layout'
import * as React from 'react'

export default function RegisterView(): React.ReactElement {
    return (
        <Layout className="layout">
            <Content className="is-fullscreen is-flex-column has-content-center-center">
                <h1>ANOVOTE</h1>
                <div className="register-form">
                    <Form className="is-flex-column" layout="vertical" name="register-form">
                        <Form.Item
                            label="Fornavn"
                            name="firstName"
                            rules={[{ required: true, message: 'Husk fornavn!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Etternavn"
                            name="lastName"
                            rules={[{ required: true, message: 'Husk etternavn!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item label="Epost" name="email" rules={[{ required: true, message: 'Husk epost!' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Husk passord!' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            label="Skriv passord igjen"
                            name="reTypePassword"
                            rules={[{ required: true, message: 'Husk passord på nytt!' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Registrer
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Content>
        </Layout>
    )
}
