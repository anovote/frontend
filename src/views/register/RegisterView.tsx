import { Button, Form, Input, Space, Spin } from 'antd'
import { AlertList } from 'components/alert/AlertList'
import StandardLayout from 'components/layout/Standard'
import { BackendAPI } from 'core/api'
import { CredentialError } from 'core/errors/CredentialsError'
import { DuplicateError } from 'core/errors/DuplicateError'
import { formRules } from 'core/helpers/formRules'
import { AlertState, useAlert } from 'core/hooks/useAlert'
import { getAdminRoute, getPublicRoute } from 'core/routes/siteRoutes'
import { AuthLevel } from 'core/service/authentication/AuthLevel'
import { RegistrationDetails } from 'core/service/registration/RegistrationDetails'
import { RegistrationService } from 'core/service/registration/RegistrationService'
import { useAppState, useAppStateDispatcher } from 'core/state/app/AppStateContext'
import * as React from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next/'
import { Redirect, useHistory } from 'react-router-dom'

export default function RegisterView(): React.ReactElement {
    const registrationService = new RegistrationService(BackendAPI)

    const [t] = useTranslation(['form', 'common', 'error'])
    const appDispatcher = useAppStateDispatcher()
    const history = useHistory<AlertState>()
    const { isLoggedIn } = useAppState()
    const rules = formRules(t)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { alertStates, dispatchAlert } = useAlert()

    const formValidated = async (form: RegistrationDetails) => {
        setIsLoading(true)
        if (form.password.trim() === form.reTypePassword.trim()) {
            try {
                await registrationService.registerOrganizer(form)
                dispatchAlert({ type: 'add', level: 'success', message: t('form:User was registered') })
                setIsLoading(false)
                appDispatcher.setLoginState(AuthLevel.organizer)
                history.replace(getAdminRoute().elections.view, alertStates[0])
            } catch (error) {
                switch (error.constructor) {
                    case CredentialError:
                        dispatchAlert({ type: 'add', level: 'error', message: t('form:Error in form') })
                        break
                    case DuplicateError:
                        dispatchAlert({
                            type: 'add',
                            level: 'info',
                            message: t('error:Email already exist'),
                            description: t('error:Try to log in'),
                        })
                        break
                    default:
                        dispatchAlert({ type: 'add', level: 'error', message: t('form:Something went wrong') })
                }
                setIsLoading(false)
            }
        } else {
            setIsLoading(false)
            dispatchAlert({
                type: 'add',
                level: 'error',
                message: t('form:Must be equal', { field: t('common:Password').toLowerCase() }),
            })
        }
    }

    return isLoggedIn ? (
        <Redirect to={getAdminRoute().elections.view} />
    ) : (
        <StandardLayout contentClassName="is-flex-column has-content-center-center">
            <h1>{t('common:Welcome to Anovote')}</h1>
            <div className="register-form">
                <div className="alert-field">
                    <AlertList
                        alerts={alertStates}
                        onRemove={(index) => dispatchAlert({ type: 'remove', index: index })}
                    />
                </div>
                <Spin spinning={isLoading}>
                    <Form className="is-flex-column" layout="vertical" name="register-form" onFinish={formValidated}>
                        <Form.Item label={t('common:First name')} name="firstName" rules={rules.firstName}>
                            <Input placeholder="Ola" />
                        </Form.Item>
                        <Form.Item label={t('common:Last name')} name="lastName" rules={rules.lastName}>
                            <Input placeholder="Nordmann" />
                        </Form.Item>
                        <Form.Item
                            label={t('common:Email')}
                            name="email"
                            rules={rules.email}
                            normalize={(val) => val.trim()}
                        >
                            <Input placeholder={t('form:Example-email')} />
                        </Form.Item>
                        <Form.Item label={t('common:Password')} name="password" rules={rules.password}>
                            <Input.Password placeholder={t('form:Your password')} />
                        </Form.Item>
                        <Form.Item
                            label={t('form:Please rewrite password')}
                            name="reTypePassword"
                            rules={rules.rePassword}
                        >
                            <Input.Password placeholder={t('form:Your password')} />
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
                </Spin>
            </div>
        </StandardLayout>
    )
}
