import { Alert, AlertProps, Button, Form, Input } from 'antd'
import Layout, { Content } from 'antd/lib/layout/layout'
import { AxiosInstance } from 'axios'
import { BackendAPI } from 'core/api'
import { apiRoute } from 'core/routes/apiRoutes'
import React, { ReactElement, useReducer } from 'react'
import { useTranslation } from 'react-i18next'

interface VoterLoginState {
    alert?: AlertProps
    isLoading: boolean
    connectToSocket: boolean
}

type VoterLoginAction = { type: 'success' | 'sendRequest' | 'closeAlert' } | { type: 'error'; alertProps: AlertProps }

const voterLoginReducer = (state: VoterLoginState, action: VoterLoginAction) => {
    console.log(action)
    switch (action.type) {
        case 'sendRequest':
            return {
                ...state,
                isLoading: true,
            }
        case 'success':
            return {
                ...state,
                isLoading: false,
            }
        case 'closeAlert':
            return {
                ...state,
                alert: undefined,
            }
        case 'error':
            return {
                ...state,
                alert: action.alertProps,
                isLoading: false,
            }

        default:
            break
    }
    return { ...state }
}

function VoterLoginView(): ReactElement {
    const [t] = useTranslation(['form', 'common'])

    const initialState: VoterLoginState = {
        isLoading: false,
        alert: undefined,
    }

    const [state, dispatch] = useReducer(voterLoginReducer, initialState)
    // todo connect to socket. wait for confirmation or disconnection

    const onSubmitHandler = async (form: JoinVoteDetails) => {
        const httpClient: AxiosInstance = BackendAPI
        const { email, electionCode } = form

        await sendConfirmationRequest(httpClient, email, electionCode)
    }

    async function sendConfirmationRequest(httpClient: AxiosInstance, email: string, electionCode: string) {
        dispatch({ type: 'sendRequest' })
        try {
            await httpClient.get(apiRoute.joinElection, {
                params: {
                    email,
                    electionCode,
                },
            })
        } catch (err) {
            console.log(err)
            dispatch({ type: 'error', alertProps: { type: 'error', message: err.message } })
        }
    }

    return (
        <Layout className="layout">
            {state.alert && (
                <Alert
                    message={state.alert?.message}
                    description={state.alert?.description}
                    type={state.alert?.type}
                    onClose={() => {
                        dispatch({ type: 'closeAlert' })
                    }}
                    showIcon
                    closable
                />
            )}
            <Content className="is-fullscreen has-content-center-center">
                <Form layout="vertical" name="vote-login-form" onFinish={onSubmitHandler}>
                    <Form.Item
                        label={t('common:Email')}
                        name={t('common:Email').toString()}
                        rules={[{ type: 'email', required: true, message: t('form:Email is not valid') }]}
                    >
                        <Input
                            disabled={state.isLoading}
                            placeholder="email@example.com"
                            defaultValue="test@test.com"
                        />
                    </Form.Item>
                    <Form.Item
                        label={t('common:Election Code')}
                        name={t('common:Election Code').toString()}
                        rules={[{ type: 'string', required: true, min: 6 }]}
                    >
                        <Input disabled={state.isLoading} defaultValue="abc123" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={state.isLoading}>
                            {t('common:Submit')}
                        </Button>
                    </Form.Item>
                </Form>
            </Content>
        </Layout>
    )
}

export default VoterLoginView

interface JoinVoteDetails {
    email: string
    electionCode: string
}
