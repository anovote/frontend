import { Button, Form, Input, Space } from 'antd'
import Layout, { Content } from 'antd/lib/layout/layout'
import { AlertList } from 'components/alert/AlertList'
import { BackendAPI } from 'core/api'
import { CredentialError } from 'core/errors/CredentialsError'
import { AlertState, useAlert } from 'core/hooks/useAlert'
import { getPublicRoute } from 'core/routes/siteRoutes'
import { AuthenticationDetails } from 'core/service/authentication/AuthenticationDetails'
import { AuthenticationService } from 'core/service/authentication/AuthenticationService'
import { AuthLevel } from 'core/service/authentication/AuthLevel'
import { LocalStorageService } from 'core/service/storage/LocalStorageService'
import { useAppState, useAppStateDispatcher } from 'core/state/app/AppStateContext'
import * as React from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, useHistory } from 'react-router-dom'

/**
 * Logins view
 * @returns view
 */
export default function LoginView(): React.ReactElement {
    const authService = new AuthenticationService(BackendAPI, new LocalStorageService())
    const [t] = useTranslation(['translation', 'common', 'form', 'profile'])
    const appDispatcher = useAppStateDispatcher()
    const history = useHistory<AlertState>()
    const { isLoggedIn } = useAppState()
    const [isLoading, setIsLoading] = useState(false)

    const { alertStates, dispatchAlert } = useAlert([{ message: '', level: undefined }])

    const formValidated = async (form: AuthenticationDetails) => {
        try {
            setIsLoading(false)
            await authService.authenticateOrganizer(form)
            appDispatcher.setLoginState(AuthLevel.organizer)
            history.replace('/admin')
        } catch (error) {
            setIsLoading(false)
            if (error instanceof CredentialError) {
                dispatchAlert({ type: 'add', level: 'error', message: t('profile:Wrong email or password') })
            } else {
                dispatchAlert({ type: 'add', level: 'error', message: t('common:Something went wrong') })
            }
        }
    }

    return isLoggedIn ? (
        <Redirect to="/admin" />
    ) : (
        <Layout className="layout">
            <Content className="is-fullscreen is-flex-column has-content-center-center">
                <h1>{t('common:Welcome to Anovote')}</h1>
                <div className="login-form">
                    <div className="error-field">
                        <AlertList
                            alerts={alertStates}
                            onRemove={(index) => dispatchAlert({ type: 'remove', index: index })}
                        />
                    </div>
                    <Form className="is-flex-column" layout="vertical" name="login-form" onFinish={formValidated}>
                        <Form.Item
                            label={t('common:Email')}
                            name="email"
                            rules={[{ required: true, message: t('form:Please provide email') }]}
                        >
                            <Input placeholder={t('form:Example-email')} />
                        </Form.Item>
                        <Form.Item
                            label={t('common:Password')}
                            name="password"
                            rules={[{ required: true, message: t('form:Please provide a password') }]}
                        >
                            <Input.Password placeholder={t('form:Your password')} />
                        </Form.Item>
                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit" loading={isLoading}>
                                    {t('common:Log In')}
                                </Button>
                                <Button
                                    onClick={() => {
                                        history.push(getPublicRoute().register)
                                    }}
                                >
                                    {t('form:Register')}
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
            </Content>
        </Layout>
    )
}
