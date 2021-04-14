import { Button, Form, Input, Space } from 'antd'
import Layout, { Content } from 'antd/lib/layout/layout'
import { BackendAPI } from 'core/api'
import { CredentialError } from 'core/errors/CredentialsError'
import { AnovoteAlertState, createAlertComponent, useAlert } from 'core/hooks/useAlert'
import { getAdminRoute, getPublicRoute } from 'core/routes/siteRoutes'
import { AuthLevel } from 'core/service/authentication/AuthLevel'
import { RegistrationDetails } from 'core/service/registration/RegistrationDetails'
import { RegistrationService } from 'core/service/registration/RegistrationService'
import { useAppState, useAppStateDispatcher } from 'core/state/app/AppStateContext'
import * as React from 'react'
import { useTranslation } from 'react-i18next/'
import { Redirect, useHistory } from 'react-router-dom'

export default function RegisterView(): React.ReactElement {
    const registrationService = new RegistrationService(BackendAPI)

    const [t] = useTranslation(['form', 'common'])
    const appDispatcher = useAppStateDispatcher()
    const history = useHistory<AnovoteAlertState>()
    const { isLoggedIn } = useAppState()

    const [alertState, alertDispatch] = useAlert({ message: '', alertType: undefined })

    const formValidated = async (form: RegistrationDetails) => {
        if (form.password.trim() === form.reTypePassword.trim()) {
            try {
                await registrationService.registerOrganizer(form)
                alertDispatch({ type: 'success', message: t('form:User was registered') })
                appDispatcher.setLoginState(AuthLevel.organizer)
                history.replace(getAdminRoute().elections.view, alertState)
            } catch (error) {
                if (error instanceof CredentialError) {
                    alertDispatch({ type: 'error', message: t('form:Error in form') })
                } else {
                    alertDispatch({ type: 'error', message: t('form:Something went wrong') })
                }
            }
        } else {
            alertDispatch({
                type: 'error',
                message: t('form:Must be equal', { field: t('common:Password').toLowerCase() }),
            })
        }
    }

    return isLoggedIn ? (
        <Redirect to={getAdminRoute().elections.view} />
    ) : (
        <Layout className="layout">
            <Content className="is-fullscreen is-flex-column has-content-center-center">
                <h1>{t('common:Welcome to Anovote')}</h1>
                <div className="register-form">
                    <div className="alert-field">{createAlertComponent(alertState)}</div>
                    <Form className="is-flex-column" layout="vertical" name="register-form" onFinish={formValidated}>
                        <Form.Item
                            label={t('common:First name')}
                            name="firstName"
                            rules={[{ required: true, message: t('form:Remember first name') }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={t('common:Last name')}
                            name="lastName"
                            rules={[{ required: true, message: t('form:Remember last name') }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={t('common:Email')}
                            name="email"
                            rules={[{ required: true, message: t('form:Remember email') }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={t('common:Password')}
                            name="password"
                            rules={[{ required: true, message: t('form:Remember password') }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            label={t('form:Please rewrite password')}
                            name="reTypePassword"
                            rules={[{ required: true, message: t('form:Remember to rewrite password') }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    {t('form:Register')}
                                </Button>
                                <Button
                                    onClick={() => {
                                        history.push(getPublicRoute().login)
                                    }}
                                >
                                    {t('form:go-to-login')}
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
            </Content>
        </Layout>
    )
}
