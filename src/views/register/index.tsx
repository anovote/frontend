import { Alert, Button, Form, Input } from 'antd'
import Layout, { Content } from 'antd/lib/layout/layout'
import * as React from 'react'
import { useHistory } from 'react-router-dom'
import { BackendAPI } from '../../core/api'
import { getAdminRoute } from '../../core/routes/siteRoutes'
import { AuthLevel } from '../../core/service/authentication/AuthLevel'
import { CredentialError } from '../../core/service/authentication/CredentialsError'
import { RegistrationDetails } from '../../core/service/registration/RegistrationDetails'
import { RegistrationService } from '../../core/service/registration/RegistrationService'
import { useAppStateDispatcher } from '../../core/state/app/AppStateContext'

export default function RegisterView(): React.ReactElement {
    const registrationService = new RegistrationService(BackendAPI)

    const [errorMessage, setErrorMessage] = React.useState('')
    const [successMessage, setSuccessMessage] = React.useState('')
    const appDispatcher = useAppStateDispatcher()
    const history = useHistory()

    const formValidated = async (form: RegistrationDetails) => {
        if (form.password.trim() === form.reTypePassword.trim()) {
            setErrorMessage('')
            try {
                await registrationService.registerOrganizer(form)
                setSuccessMessage('Brukeren ble registrert!')

                appDispatcher.setLoginState(AuthLevel.organizer)
                history.replace(getAdminRoute().myElections)
            } catch (error) {
                if (error instanceof CredentialError) {
                    setErrorMessage('Feil i utfyldingen av skjemaet')
                } else {
                    setErrorMessage('Noe gikk galt, prøv igjen senere')
                }
            }
        } else {
            setErrorMessage('Passordene er ikke like!')
        }
    }

    return (
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
                            label="Passord"
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
