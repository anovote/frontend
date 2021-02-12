import { Alert, Button, Form, Input } from 'antd'
import Layout, { Content } from 'antd/lib/layout/layout'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { BackendAPI } from '../../core/api'
import { AuthenticationDetails } from '../../core/service/authentication/AuthenticationDetails'
import { AuthenticationService } from '../../core/service/authentication/AuthenticationService'
import { CredentialError } from '../../core/service/authentication/CredentialsError'

/**
 * Logins view
 * @returns view
 */
export default function LoginView(): React.ReactElement {
    const authService = new AuthenticationService(BackendAPI)
    const [t] = useTranslation(['translation', 'common'])
    const [errorMessage, setErrorMessage] = React.useState('')

    const formValidated = async (form: AuthenticationDetails) => {
        setErrorMessage('')
        try {
            await authService.authenticateOrganizer(form)
        } catch (error) {
            if (error instanceof CredentialError) {
                setErrorMessage('Feil epost/passord')
            } else {
                setErrorMessage('Noe gikk galt, prøv igjen senere')
            }
        }
    }

    return (
        <Layout className="layout">
            <Content className="is-fullscreen is-flex-column has-content-center-center">
                <h1>{t('Welcome to Anovote')}</h1>
                <div className="login-form">
                    <div className="error-field">
                        {!!errorMessage && <Alert message={errorMessage} type={'warning'} showIcon closable />}
                    </div>
                    <Form className="is-flex-column" layout="vertical" name="login-form" onFinish={formValidated}>
                        <Form.Item
                            label="Epost"
                            name="email"
                            rules={[{ required: true, message: 'Vennligst fyll inn epost!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Passord"
                            name="password"
                            rules={[{ required: true, message: 'Vennligst fyll inn ett passord!' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                {t('common:Log In')}
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Content>
        </Layout>
    )
}
