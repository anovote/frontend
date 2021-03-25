import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import CenterView from 'components/centerView/CenterView'
import IconMessage from 'components/iconMessage/IconMessage'
import { IIconMessage } from 'components/iconMessage/IIconMessage'
import useIconMessageState from 'components/iconMessage/UseIconMessage'
import VoterContent from 'components/voterContent/VoterContent'
import VoterFooter from 'components/voterFooter/VoterFooter'
import VoterHeader from 'components/voterHeader/VoterHeader'
import { Events } from 'core/events'
import { Timeout } from 'core/helpers/Timeout'
import { useQuery } from 'core/hooks/useQuery'
import { useSocket } from 'core/hooks/useSocket'
import { LocalStorageService } from 'core/service/storage/LocalStorageService'
import { useAppStateDispatcher } from 'core/state/app/AppStateContext'
import React, { ReactElement, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import {
    joinVerificationEvent,
    verifyConnectErrorEvent,
    verifyConnectEvent,
    verifyUpgradeToJoinAck,
    verifyVoterIntegrityAck,
} from './Events'
import { IVerificationPayload } from './IVerificationPayload'

export default function VerifyVoterView(): ReactElement {
    const [socket] = useSocket()
    const [t] = useTranslation(['error', 'voter', 'common', 'election'])
    const history = useHistory()
    const appStateDispatcher = useAppStateDispatcher()
    const query = useQuery()
    const codeToVerify = query.get('code')
    const verificationMessage: IIconMessage = {
        label: t('voter:Verifying code'),
        alertMessage: t('voter:Please do not close this window'),
        alertLevel: 'warning',
    }
    const verificationCodeMissingMessage: IIconMessage = {
        label: t('error:Verification code is missing'),
    }
    const [statusState, setStatusState] = useIconMessageState(verificationMessage)

    useEffect(() => {
        if (codeToVerify) {
            const storageService = new LocalStorageService()
            const upgradeTimeout = new Timeout(2000, () => {
                socket.emit(
                    Events.client.auth.upgradeVerificationToJoin,
                    {},
                    verifyUpgradeToJoinAck(setStatusState, t, storageService, appStateDispatcher, history),
                )
            })
            const verificationPayload: IVerificationPayload = {
                code: codeToVerify,
            }
            const voterIntegrityAck = verifyVoterIntegrityAck(setStatusState, upgradeTimeout, t)
            const connectEvent = verifyConnectEvent(socket, verificationPayload, upgradeTimeout, voterIntegrityAck)
            const connectErrorEvent = verifyConnectErrorEvent(setStatusState, upgradeTimeout, t)
            const verifiedEvent = joinVerificationEvent(setStatusState, upgradeTimeout, t)
            socket.on(Events.standard.socket.connect, connectEvent)
            socket.on(Events.standard.socket.connectError, connectErrorEvent)
            // Join page successfully joined the election
            socket.once(Events.server.auth.joinVerified, verifiedEvent)
            socket.connect()

            return () => {
                // Cleanup all events
                socket.removeListener(Events.standard.socket.connect, connectEvent)
                socket.removeListener(Events.standard.socket.connectError, connectErrorEvent)
                // Join page successfully joined the election
                socket.removeListener(Events.server.auth.joinVerified, verifiedEvent)
            }
        } else {
            setStatusState(verificationCodeMissingMessage)
        }
    }, [])

    return (
        <CenterView>
            <Layout className="small-container">
                <VoterHeader slogan="Anovote" />
                <Content className="voter-election-layout-content">
                    <VoterContent>
                        <IconMessage
                            label={statusState.label}
                            alertLevel={statusState.alertLevel}
                            alertMessage={statusState.alertMessage}
                            icon={statusState.icon}
                        />
                    </VoterContent>
                </Content>
                <VoterFooter />
            </Layout>
        </CenterView>
    )
}
