import { Divider } from 'antd'
import Layout, { Content } from 'antd/lib/layout/layout'
import CenterView from 'components/centerView/CenterView'
import VoterContent from 'components/voterContent/VoterContent'
import VoterFooter from 'components/voterFooter/VoterFooter'
import VoterHeader from 'components/voterHeader/VoterHeader'
import { LogoutButton } from 'containers/modal/LogoutButton'
import { BackendAPI } from 'core/api'
import { Events } from 'core/events'
import { useSocket } from 'core/hooks/useSocket'
import { getPublicRoute } from 'core/routes/siteRoutes'
import { AuthenticationService } from 'core/service/authentication/AuthenticationService'
import { IVoterToken } from 'core/service/authentication/IToken'
import { LocalStorageService } from 'core/service/storage/LocalStorageService'
import { StorageKeys } from 'core/service/storage/StorageKeys'
import { WebsocketEvent } from 'core/socket/EventHandler'
import { electionReducer, initialElectionState } from 'core/state/election/electionReducer'
import { electionSocketEventBinder, electionSocketEventCleanup } from 'core/state/election/electionSocketEventBinder'
import React, { ReactElement, useEffect, useReducer } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import ElectionContentHandler from './ElectionContentHandler'
import ElectionInfoHandler from './ElectionInfoHandler'
export default function VoterElectionView(): ReactElement {
    const [electionState, electionDispatch] = useReducer(electionReducer, initialElectionState)
    const [socket] = useSocket()
    const history = useHistory()
    const [t] = useTranslation('voter')

    useEffect(() => {
        socket.connect()

        function goToJoin() {
            history.replace(getPublicRoute().joinElection)
        }

        function bindEvents() {
            electionSocketEventBinder(socket, electionDispatch)
        }
        /**
         * Tries get an election from the stored token if it exists, if an election is
         * returned and it is still open, we set the election state.
         * Else do nothing
         */
        async function tryJoinWithToken() {
            try {
                const authenticationService = new AuthenticationService(
                    BackendAPI,
                    new LocalStorageService<StorageKeys>(),
                )

                if (!authenticationService.hasValidAuthorizationToken()) {
                    return goToJoin()
                }

                const decodedToken = authenticationService.getDecodedToken() as IVoterToken | undefined
                if (!decodedToken?.electionId) {
                    return goToJoin()
                }
                socket.emit(
                    Events.client.auth.withToken,
                    { token: 'Bearer: ' + authenticationService.getAuthorizationToken() },
                    WebsocketEvent({
                        dataHandler: bindEvents,
                        errorHandler: goToJoin,
                    }),
                )
            } catch (error) {
                goToJoin()
            }
        }

        if (!socket.auth.authenticated) {
            tryJoinWithToken()
        } else {
            bindEvents()
        }

        return () => {
            electionSocketEventCleanup()
        }
    }, [])

    return (
        <CenterView>
            <Layout className="small-container">
                <VoterHeader slogan="Anovote" />
                <Content className="voter-election-layout-content">
                    <ElectionInfoHandler state={electionState} />
                    <Divider />
                    <VoterContent>
                        <ElectionContentHandler state={electionState} />
                        <LogoutButton
                            confirmation={{
                                title: t('voter:Are you sure you want to logout'),
                                content: <Trans i18nKey="voter:logout description" />,
                            }}
                        />
                    </VoterContent>
                </Content>
                <VoterFooter />
            </Layout>
        </CenterView>
    )
}
