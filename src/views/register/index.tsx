import { Button, Form, Input, Space, Spin } from 'antd'
import Layout, { Content } from 'antd/lib/layout/layout'
import { AlertList } from 'components/alert/AlertList'
import { BackendAPI } from 'core/api'
import { CredentialError } from 'core/errors/CredentialsError'
import { formRules, IFormRules } from 'core/helpers/formRules'
import { AlertState, useAlert } from 'core/hooks/useAlert'
import { getAdminRoute, getPublicRoute } from 'core/routes/siteRoutes'
import { AuthLevel } from 'core/service/authentication/AuthLevel'
import { RegistrationDetails } from 'core/service/registration/RegistrationDetails'
import { RegistrationService } from 'core/service/registration/RegistrationService'
import { useAppState, useAppStateDispatcher } from 'core/state/app/AppStateContext'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next/'
import { Redirect, useHistory } from 'react-router-dom'

export default function RegisterView(): React.ReactElement {
    const registrationService = new RegistrationService(BackendAPI)

    const [ t, i18n ] = useTranslation(['form', 'common'])
    const appDispatcher = useAppStateDispatcher()
    const history = useHistory<AlertState>()
    const { isLoggedIn } = useAppState()
    const [rules, setRules] = useState<IFormRules>()

    const [alertStates, dispatchAlert] = useAlert([{ message: '', level: undefined }])

    const formValidated = async (form: RegistrationDetails) => {
        if (form.password.trim() === form.reTypePassword.trim()) {
            try {
                await registrationService.registerOrganizer(form)
                dispatchAlert({ type: 'add', level: 'success', message: t('form:User was registered') })
                appDispatcher.setLoginState(AuthLevel.organizer)
                history.replace(getAdminRoute().elections.view, alertStates[0])
            } catch (error) {
                if (error instanceof CredentialError) {
                    dispatchAlert({ type: 'add', level: 'error', message: t('form:Error in form') })
                } else {
                    dispatchAlert({ type: 'add', level: 'error', message: t('form:Something went wrong') })
                }
            }
        } else {
            dispatchAlert({
                type: 'add',
                level: 'error',
                message: t('form:Must be equal', { field: t('common:Password').toLowerCase() }),
            })
        }
    }

    /**
     * Getting the rules
     */
    useEffect(() => {
        formRules(i18n)
            .then((data) => {
                setRules(data)
            })
            .catch((err) => {
                throw err
            })
    }, [])

    return isLoggedIn ? (
        <Redirect to={getAdminRoute().elections.view} />
    ) : rules ? (
        <Layout className="layout">
            <Content className="is-fullscreen is-flex-column has-content-center-center">
                <h1>{t('common:Welcome to Anovote')}</h1>
                <div className="register-form">
                    <div className="alert-field">
                        <AlertList alerts={alertStates} />
                    </div>
                    <Form className="is-flex-column" layout="vertical" name="register-form" onFinish={formValidated}>
                        <Form.Item label={t('common:First name')} name="firstName" rules={rules.firstName}>
                            <Input />
                        </Form.Item>
                        <Form.Item label={t('common:Last name')} name="lastName" rules={rules.lastName}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={t('common:Email')}
                            name="email"
                            rules={rules.email}
                            normalize={(val) => val.trim()}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item label={t('common:Password')} name="password" rules={rules.password}>
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            label={t('form:Please rewrite password')}
                            name="reTypePassword"
                            rules={rules.rePassword}
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
    ) : (
        <Spin />
    )
}
