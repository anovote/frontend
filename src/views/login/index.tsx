import { Alert, Button, Form, Input } from 'antd'
import Layout, { Content } from 'antd/lib/layout/layout'
import { LocalStorageService } from 'core/service/storage/LocalStorageService'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { BackendAPI } from '../../core/api'
import { getAdminRoute } from '../../core/routes/siteRoutes'
import { AuthenticationDetails } from '../../core/service/authentication/AuthenticationDetails'
import { AuthenticationService } from '../../core/service/authentication/AuthenticationService'
import { AuthLevel } from '../../core/service/authentication/AuthLevel'
import { CredentialError } from '../../core/service/authentication/CredentialsError'
import { useAppStateDispatcher } from '../../core/state/app/AppStateContext'

/**
 * Logins view
 * @returns view
 */
export default function LoginView(): React.ReactElement {
    const authService = new AuthenticationService(BackendAPI, new LocalStorageService())
    const [t] = useTranslation(['translation', 'common'])
    const [errorMessage, setErrorMessage] = React.useState('')
    const appDispatcher = useAppStateDispatcher()
    const history = useHistory()
    const formValidated = async (form: AuthenticationDetails) => {
        setErrorMessage('')
        try {
            await authService.authenticateOrganizer(form)
            appDispatcher.setLoginState(AuthLevel.organizer)
            history.replace('/protected/elections')
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
