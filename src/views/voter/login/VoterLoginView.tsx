import { Button, Form, Input, Space } from 'antd'
import Layout, { Content } from 'antd/lib/layout/layout'
import CenterView from 'components/centerView/CenterView'
import IconMessage from 'components/iconMessage/IconMessage'
import { IIconMessage } from 'components/iconMessage/IIconMessage'
import VoterContent from 'components/voterContent/VoterContent'
import VoterContentInfo from 'components/voterContentInfo/VoterContentInfo'
import VoterFooter from 'components/voterFooter/VoterFooter'
import VoterHeader from 'components/voterHeader/VoterHeader'
import { Events } from 'core/events'
import { getVoterRoute } from 'core/routes/siteRoutes'
import { AuthLevel } from 'core/service/authentication/AuthLevel'
import { LocalStorageService } from 'core/service/storage/LocalStorageService'
import { StorageKeys } from 'core/service/storage/StorageKeys'
import { useAppStateDispatcher } from 'core/state/app/AppStateContext'
import { useSocket } from 'core/state/websocket/useSocketHook'
import { StatusCodes } from 'http-status-codes'
import React, { ReactElement, useEffect, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { voterLoginReducer, VoterLoginState } from './VoterLoginState'
/**
 * A view for a voter to give email and election code in order to join an election
 * Sends events via socketIO to the server
 */
function VoterLoginView(): ReactElement {
    const [socket] = useSocket()
    const [t] = useTranslation(['form', 'common', 'voter'])
    const history = useHistory()
    const appStateDispatcher = useAppStateDispatcher()
    const initialState: VoterLoginState = {
        isLoading: false,
        showMessage: false,
    }
    const [state, dispatch] = useReducer(voterLoginReducer, initialState)

    useEffect(() => {
        dispatch({ type: 'isLoading', payload: true })
        socket.connect()

        socket.on(Events.standard.socket.connect, () => {
            dispatch({ type: 'isLoading', payload: false })
            dispatch({ type: 'hideMessage' })
        })
        socket.on(Events.standard.socket.connectError, () => {
            dispatch({
                type: 'showMessage',
                payload: { label: t('common:Unable to connect to server'), alertLevel: 'error' },
            })
        })

        socket.once(Events.server.auth.verified, (data: { token: string }) => {
            const localStorageService = new LocalStorageService<StorageKeys>()
            localStorageService.setItem('ACCESS_TOKEN', data.token)
            appStateDispatcher.setLoginState(AuthLevel.voter)
            history.replace(getVoterRoute().election)
        })
    }, [])

    const evn = (confirmationData: ConfirmationSocketData) => {
        const { statusCode } = confirmationData
        if (statusCode === StatusCodes.OK) {
            dispatch({
                type: 'showMessage',
                payload: {
                    label: t('voter:Verification link sent to your', { type: t('common:Email').toLowerCase() }),
                    alertMessage: t('voter:Please do not close this window'),
                    alertLevel: 'success',
                },
            })
        } else {
            dispatch({
                type: 'showMessage',
                payload: { label: t('voter:Voter verification failed'), alertLevel: 'error' },
            })
        }
    }

    const onSubmitHandler = async (form: JoinVoteDetails) => {
        const { email, electionCode } = form
        await sendConfirmationRequest(email, electionCode)
    }
    async function sendConfirmationRequest(email: string, electionCode: string) {
        dispatch({ type: 'isLoading', payload: true })
        const data = { email, electionCode }
        socket.emit(Events.client.auth.join, data, evn)
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

interface ConfirmationSocketData {
    message?: string
    statusCode: StatusCodes
}
