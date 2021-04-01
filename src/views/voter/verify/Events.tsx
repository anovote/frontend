import { IIconMessage } from 'components/iconMessage/IIconMessage'
import { ErrorCodeResolver } from 'core/error/ErrorCodeResolver'
import { Events } from 'core/events'
import { Timeout } from 'core/helpers/Timeout'
import { getVoterRoute } from 'core/routes/siteRoutes'
import { AuthLevel } from 'core/service/authentication/AuthLevel'
import { LocalStorageService } from 'core/service/storage/LocalStorageService'
import { StorageKeys } from 'core/service/storage/StorageKeys'
import { EventExecutor, WebsocketEvent } from 'core/socket/EventHandler'
import { IAppStateDispatcher } from 'core/state/app/AppStateContext'
import { AnoSocket } from 'core/state/websocket/IAnoSocket'
import * as H from 'history'
import { TFunction } from 'react-i18next'
import { IVerificationPayload } from './IVerificationPayload'

// When verify page connects
export const verifyConnectEvent = (
    socket: SocketIOClient.Socket,
    verificationPayload: IVerificationPayload,
    upgradeTimeout: Timeout,
    voterIntegrityAck: EventExecutor<undefined>,
): EventExecutor<undefined> => {
    return WebsocketEvent({
        dataHandler: () => {
            // Starts the verification
            socket.emit(Events.client.auth.verify.voterIntegrity, verificationPayload, voterIntegrityAck)
            // Start the upgrade timer that will upgrade the verification page if timer executes
            upgradeTimeout.start()
        },
    })
}
// When verify has connection error
export const verifyConnectErrorEvent = (
    setStatusState: (value: IIconMessage) => void,
    upgradeTimeout: Timeout,
    t: TFunction<string[]>,
): EventExecutor<undefined> => {
    const connectionFailedMessage: IIconMessage = {
        label: t('error:Voter verification failed'),
        alertMessage: t('common:Unexpected error'),
        alertLevel: 'error',
    }
    return WebsocketEvent({
        dataHandler: () => {
            // Prevent upgrade for occurring as we have connect error
            upgradeTimeout.stop()
            setStatusState(connectionFailedMessage)
        },
    })
}
// When join page has received the verification details, joined
export const joinVerificationEvent = (
    setStatusState: (value: IIconMessage) => void,
    upgradeTimeout: Timeout,
    t: TFunction<string[]>,
): EventExecutor<undefined> => {
    const verificationSuccessMessage: IIconMessage = {
        label: t('voter:Voter verification succeeded'),
        alertMessage: t('voter:This browser tab can ble closed'),
        alertLevel: 'success',
    }
    return WebsocketEvent({
        dataHandler: () => {
            // Stop the upgrade timer no as the join page has received the token and joined
            upgradeTimeout.stop()
            setStatusState(verificationSuccessMessage)
        },
    })
}

// When verification is emitted to server and waiting for server ack on status of verification
export const verifyVoterIntegrityAck = (
    setStatusState: (value: IIconMessage) => void,
    upgradeTimeout: Timeout,
    t: TFunction<string[]>,
): EventExecutor<undefined> => {
    return WebsocketEvent({
        dataHandler: () => {
            // Disable the upgrade timer
            upgradeTimeout.stop()
            setStatusState({
                label: t('voter:Voter verification succeeded'),
            })
        },
        errorHandler: (error) => {
            // Disable the upgrade timer
            upgradeTimeout.stop()
            const { code } = error
            const errorCodeResolver = new ErrorCodeResolver(t)
            const label = errorCodeResolver.resolve(code)
            setStatusState({
                label,
                alertLevel: 'error',
            })
        },
    })
}

interface IUpgradePayload {
    token: string
}
// When join page was not able to send verification received event, and upgrade timer has executed
export const verifyUpgradeToJoinAck = (
    setStatusState: (value: IIconMessage) => void,
    t: TFunction<string[]>,
    storageService: LocalStorageService<StorageKeys>,
    appStateDispatcher: IAppStateDispatcher,
    history: H.History,
    socket: AnoSocket,
): EventExecutor<IUpgradePayload> => {
    return WebsocketEvent({
        dataHandler: (data) => {
            // Display upgrade notice
            setStatusState({
                label: t('error:Upgrading verification'),
                alertMessage: t('voter:Please do not close this window'),
            })

            socket.auth.authenticated = true
            storageService.setItem('ACCESS_TOKEN', data.token)
            appStateDispatcher.setLoginState(AuthLevel.voter)

            /**
             * Event though the token has arrived and we are ready to route, we wait 3 seconds before
             * we display success. so the user is aware what has happened
             */
            new Timeout(3000, () => {
                setStatusState({
                    label: t('voter:Voter verification succeeded'),
                })
            }).start()

            // Route after 5 seconds, hopefully that the user is aware of the upgrade that happened
            new Timeout(5000, () => {
                history.replace(getVoterRoute().election)
            }).start()
        },
        errorHandler: (error) => {
            const { code } = error
            const errorCodeResolver = new ErrorCodeResolver(t)
            const label = errorCodeResolver.resolve(code)

            setStatusState({
                label,
                alertLevel: 'error',
            })
        },
    })
}
