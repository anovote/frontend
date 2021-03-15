import { Alert, Button, Form, Input } from 'antd'
import Layout, { Content } from 'antd/lib/layout/layout'
import { Events } from 'core/events'
import { useSocket } from 'core/hooks/useSocketHook'
import { StatusCodes } from 'http-status-codes'
import React, { ReactElement, useEffect, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { VoterLoginState, voterLoginReducer } from './VoterLoginState'

/**
 * A view for a voter to give email and election code in order to join an election
 * Sends events via socketIO to the server
 */
function VoterLoginView(): ReactElement {
    const [socket] = useSocket()
    const [t] = useTranslation(['form', 'common'])

    useEffect(() => {
        dispatch({ type: 'connectToSocket' })
        socket.connect()

        socket.on(Events.standard.socket.connect, () => {
            dispatch({ type: 'connectedToSocket' })
        })

        socket.on(Events.standard.socket.confirmReceivedJoin, (confirmationData: ConfirmationSocketData) => {
            const { statusCode, message } = confirmationData
            if (statusCode === StatusCodes.OK) {
                dispatch({ type: 'emailSent', alertProps: { type: 'success', message } })
            }
        })

        return () => {
            socket.disconnect()
        }
    }, [])

    const initialState: VoterLoginState = {
        isLoading: false,
        alert: undefined,
    }

    const [state, dispatch] = useReducer(voterLoginReducer, initialState)
    // todo connect to socket. wait for confirmation or disconnection

    const onSubmitHandler = async (form: JoinVoteDetails) => {
        const { email, electionCode } = form
        await sendConfirmationRequest(email, electionCode)
    }

    async function sendConfirmationRequest(email: string, electionCode: string) {
        dispatch({ type: 'sendRequest' })
        try {
            const data = { email, electionCode }

            socket.emit('join', data)
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
                        name="email"
                        rules={[{ type: 'email', required: true, message: t('form:Email is not valid') }]}
                    >
                        <Input disabled={state.isLoading} placeholder="email@example.com" />
                    </Form.Item>
                    <Form.Item
                        label={t('common:Election Code')}
                        name={'electionCode'}
                        rules={[{ type: 'string', required: true, min: 6 }]}
                    >
                        <Input disabled={state.isLoading} />
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

interface ConfirmationSocketData {
    message?: string
    statusCode: StatusCodes
}
