import { Alert, Button, Form, Input, Space } from 'antd'
import Layout, { Content } from 'antd/lib/layout/layout'
import * as React from 'react'
import { useTranslation } from 'react-i18next/'
import { Link, Redirect, useHistory } from 'react-router-dom'
import { BackendAPI } from 'core/api'
import { getAdminRoute, getPublicRoute } from 'core/routes/siteRoutes'
import { AuthLevel } from 'core/service/authentication/AuthLevel'
import { CredentialError } from 'core/errors/CredentialsError'
import { RegistrationDetails } from 'core/service/registration/RegistrationDetails'
import { RegistrationService } from 'core/service/registration/RegistrationService'
import { useAppStateDispatcher } from 'core/state/app/AppStateContext'
import { useIsLoggedIn } from 'core/hooks/useIsLoggedIn'

export default function RegisterView(): React.ReactElement {
    const registrationService = new RegistrationService(BackendAPI)

    const [t] = useTranslation(['form', 'common'])
    const [errorMessage, setErrorMessage] = React.useState('')
    const [successMessage, setSuccessMessage] = React.useState('')
    const appDispatcher = useAppStateDispatcher()
    const history = useHistory()
    const [isLoggedIn] = useIsLoggedIn()

    const formValidated = async (form: RegistrationDetails) => {
        if (form.password.trim() === form.reTypePassword.trim()) {
            setErrorMessage('')
            try {
                await registrationService.registerOrganizer(form)
                setSuccessMessage(t('form:User was registered'))

                appDispatcher.setLoginState(AuthLevel.organizer)
                history.replace(getAdminRoute().elections.view)
            } catch (error) {
                if (error instanceof CredentialError) {
                    setErrorMessage(t('form:Error in form'))
                } else {
                    setErrorMessage(t('form:Something went wrong'))
                }
            }
        } else {
            setErrorMessage(t('form:Must be equal', { field: t('common:Password').toLowerCase() }))
        }
    }

    return isLoggedIn ? (
        <Redirect to={getAdminRoute().elections.view} />
    ) : (
        <Layout className="layout">
            <Content className="is-fullscreen is-flex-column has-content-center-center">
                <h1>ANOVOTE</h1>
                <div className="register-form">
                    <div className="alert-field">
                        {!!successMessage && <Alert message={successMessage} type={'success'} showIcon closable />}
                        {!!errorMessage && <Alert message={errorMessage} type={'warning'} showIcon closable />}
                    </div>
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
                                <Button>
                                    <Link to={getPublicRoute().login}>Go to Login</Link>
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
            </Content>
        </Layout>
    )
}
