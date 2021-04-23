import { Button, Form, Input, Result, Space, Tooltip } from 'antd'
import Text from 'antd/lib/typography'
import Layout, { Content } from 'antd/lib/layout/layout'
import CenterView from 'components/centerView/CenterView'
import IconMessage from 'components/iconMessage/IconMessage'
import VoterContent from 'components/voterContent/VoterContent'
import VoterContentInfo from 'components/voterContentInfo/VoterContentInfo'
import VoterFooter from 'components/voterFooter/VoterFooter'
import VoterHeader from 'components/voterHeader/VoterHeader'
import { BackendAPI } from 'core/api'
import { Events } from 'core/events'
import { useSocket } from 'core/hooks/useSocket'
import { ElectionStatus } from 'core/models/election/ElectionStatus'
import { IElectionBase } from 'core/models/election/IElectionBase'
import { getVoterRoute } from 'core/routes/siteRoutes'
import { AuthenticationService } from 'core/service/authentication/AuthenticationService'
import { IVoterToken } from 'core/service/authentication/IToken'
import { ElectionService } from 'core/service/election/ElectionService'
import { LocalStorageService } from 'core/service/storage/LocalStorageService'
import { StorageKeys } from 'core/service/storage/StorageKeys'
import { AsyncEmit } from 'core/socket/AsyncEmit'
import { useAppStateDispatcher } from 'core/state/app/AppStateContext'
import { voterLoginReducer, VoterLoginState } from 'core/state/login/VoterLoginState'
import React, { ReactElement, useEffect, useReducer, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { joinAckEvent, joinConnectErrorEvent, joinConnectEvent, joinVerifiedEvent } from './Events'
import Link from 'antd/lib/typography/Link'
import { QuestionCircleOutlined } from '@ant-design/icons'

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
    const [election, setElection] = useState<undefined | IElectionBase>(undefined)
    const authenticationService = new AuthenticationService(BackendAPI, new LocalStorageService<StorageKeys>())
    useEffect(() => {
        const connectEvent = joinConnectEvent(dispatch)
        const connectErrorEvent = joinConnectErrorEvent(dispatch, t)
        const verifiedEvent = joinVerifiedEvent(
            socket,
            history,
            appStateDispatcher,
            new LocalStorageService<StorageKeys>(),
        )

        /**
         * Tries get an election from the stored token if it exists, if an election is
         * returned and it is still open, we set the election state.
         * Else do nothing
         */
        async function trySetElectionFromToken() {
            try {
                if (authenticationService.hasValidAuthorizationToken()) {
                    const token = authenticationService.getDecodedToken() as IVoterToken
                    if (!token.electionId) return // Break here if the election id is not presented
                    const electionService = new ElectionService(BackendAPI)
                    const election = await electionService.getElectionForVoter(token.electionId)
                    // Only set the election if it is not finished, as we do not want them to re-join an ended election
                    if (election.status !== ElectionStatus.Finished) {
                        setElection(election)
                    }
                }
            } catch (error) {
                // We do nothing here
            }
        }

        trySetElectionFromToken()

        socket.connect()
        socket.on(Events.standard.socket.connect, connectEvent)
        socket.on(Events.standard.socket.connectError, connectErrorEvent)
        socket.once(Events.server.auth.voterVerified, verifiedEvent)

        return () => {
            socket.removeListener(Events.standard.socket.connect, connectEvent)
            socket.removeListener(Events.standard.socket.connectError, connectErrorEvent)
            socket.removeListener(Events.server.auth.voterVerified, verifiedEvent)
        }
    }, [])

    /**
     * Starts the join sequence when form is submitted
     * @param form form data
     */
    const onSubmitHandler = async (form: JoinVoteDetails) => {
        const { email, electionCode } = form
        await join(email, electionCode)
    }

    /**
     * Sets loading state, and emits a join event to the server.
     * If the join fails displays an error message
     * @param email email of the voter that is joining
     * @param electionCode election code for the election it is joining
     */
    async function join(email: string, electionCode: string) {
        try {
            dispatch({ type: 'isLoading', payload: true })
            const data = { email, electionCode }
            const ackEvent = joinAckEvent(dispatch, t)
            await AsyncEmit({ socket, event: Events.client.auth.join, data, ack: ackEvent })
        } catch (error) {
            dispatch({ type: 'showMessage', payload: { label: t('error:Voter verification failed') } })
        }
    }

    function gotoElectionPage() {
        history.replace(getVoterRoute().election)
    }

    const MAX_ELECTION_CODE_LENGTH = 5
    return (
        <CenterView>
            <Layout className="small-container">
                <VoterHeader slogan="Anovote" />
                {election && (
                    <Result
                        status="info"
                        title={t('voter:You are already part of an election', { election: election.title })}
                        subTitle={t('voter:Do you want to re-join')}
                        extra={[
                            <Button type="primary" key="join" onClick={gotoElectionPage}>
                                Join
                            </Button>,
                            <Button type="default" key="cancel" onClick={() => setElection(undefined)}>
                                Cancel
                            </Button>,
                        ]}
                    />
                )}
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
                                    normalize={(val) => val.trim()}
                                    rules={[
                                        {
                                            type: 'email',
                                            required: true,
                                            message: t('form:Email is not valid'),
                                        },
                                    ]}
                                >
                                    <Input disabled={state.isLoading} placeholder="email@example.com" />
                                </Form.Item>
                                <Form.Item
                                    label={
                                        <Space>
                                            <Text>Election code</Text>
                                            <Tooltip
                                                title={t(
                                                    'voter:The election code is provided by the election organizer',
                                                )}
                                                placement="right"
                                            >
                                                <QuestionCircleOutlined />
                                            </Tooltip>
                                        </Space>
                                    }
                                    name={'electionCode'}
                                    rules={[
                                        { type: 'string', required: true, message: t('form:Is required') },
                                        {
                                            max: MAX_ELECTION_CODE_LENGTH,
                                            message: t('form:max-length', { maxLength: MAX_ELECTION_CODE_LENGTH }),
                                        },
                                    ]}
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
