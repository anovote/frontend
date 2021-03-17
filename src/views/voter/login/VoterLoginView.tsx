import { Button, Form, Input } from 'antd'
import Layout, { Content } from 'antd/lib/layout/layout'
import CenterView from 'components/centerView/CenterView'
import IconMessage from 'components/iconMessage/IconMessage'
import VoterContent from 'components/voterContent/VoterContent'
import VoterContentInfo from 'components/voterContentInfo/VoterContentInfo'
import VoterFooter from 'components/voterFooter/VoterFooter'
import VoterHeader from 'components/voterHeader/VoterHeader'
import { Events } from 'core/events'
import { AsyncEmit } from 'core/socket/AsyncEmit'
import { useAppStateDispatcher } from 'core/state/app/AppStateContext'
import { useSocket } from 'core/state/websocket/useSocketHook'
import React, { ReactElement, useEffect, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { joinAckEvent, joinConnectErrorEvent, joinConnectEvent, joinVerifiedEvent } from './Events'
import { voterLoginReducer, VoterLoginState } from './VoterLoginState'
/**
 * A view for a voter to give email and election code in order to join an election
 * Sends events via socketIO to the server
 */
function VoterLoginView(): ReactElement {
    const [socket] = useSocket()
    const [t] = useTranslation(['error', 'form', 'common', 'voter'])
    const history = useHistory()
    const appStateDispatcher = useAppStateDispatcher()
    const initialState: VoterLoginState = {
        isLoading: false,
        showMessage: false,
    }
    const [state, dispatch] = useReducer(voterLoginReducer, initialState)

    useEffect(() => {
        const connectEvent = joinConnectEvent(dispatch)
        const connectErrorEvent = joinConnectErrorEvent(dispatch, t)
        const verifiedEvent = joinVerifiedEvent(socket, history, appStateDispatcher)
        dispatch({ type: 'isLoading', payload: true })

        socket.connect()
        socket.on(Events.standard.socket.connect, connectEvent)
        socket.on(Events.standard.socket.connectError, connectErrorEvent)
        socket.once(Events.server.auth.verified, verifiedEvent)

        return () => {
            socket.removeListener(Events.standard.socket.connect, connectEvent)
            socket.removeListener(Events.standard.socket.connectError, connectErrorEvent)
            socket.removeListener(Events.server.auth.verified, verifiedEvent)
        }
    }, [])

    const onSubmitHandler = async (form: JoinVoteDetails) => {
        const { email, electionCode } = form
        await sendConfirmationRequest(email, electionCode)
    }
    async function sendConfirmationRequest(email: string, electionCode: string) {
        try {
            dispatch({ type: 'isLoading', payload: true })
            const data = { email, electionCode }
            const ackEvent = joinAckEvent(dispatch, t)
            await AsyncEmit({ socket, event: Events.client.auth.join, data, ack: ackEvent })
        } catch (error) {
            dispatch({ type: 'showMessage', payload: { label: t('error:Voter verification failed') } })
        }
    }

    return (
        <CenterView>
            <Layout className="small-container">
                <VoterHeader slogan="Anovote" />
                <Content className="voter-election-layout-content">
                    <VoterContentInfo title={t('voter:Join election')}></VoterContentInfo>
                    <VoterContent>
                        {(state.showMessage && state.message && (
                            <IconMessage
                                onClose={() => dispatch({ type: 'hideMessage' })}
                                label={state.message.label}
                                alertLevel={state.message.alertLevel}
                                alertMessage={state.message.alertMessage}
                            />
                        )) || (
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
                                    rules={[{ type: 'string', required: true, message: t('form:Is required') }]}
                                >
                                    <Input disabled={state.isLoading} />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={state.isLoading}>
                                        {t('common:Submit')}
                                    </Button>
                                </Form.Item>
                            </Form>
                        )}
                    </VoterContent>
                </Content>
                <VoterFooter />
            </Layout>
        </CenterView>
    )
}

export default VoterLoginView

interface JoinVoteDetails {
    email: string
    electionCode: string
}
