import { EventExecutor, WebsocketEvent } from 'core/socket/EventHandler'
import { AnoSocket } from 'core/state/websocket/IAnoSocket'
import { TFunction } from 'react-i18next'
import { VoterLoginAction } from './VoterLoginState'
import * as H from 'history'
import { LocalStorageService } from 'core/service/storage/LocalStorageService'
import { StorageKeys } from 'core/service/storage/StorageKeys'
import { IAppStateDispatcher } from 'core/state/app/AppStateContext'
import { getVoterRoute } from 'core/routes/siteRoutes'
import { AuthLevel } from 'core/service/authentication/AuthLevel'
import { StatusCodes } from 'http-status-codes'
import { ErrorCode } from 'core/error/ErrorCodes'
import { Events } from 'core/events'

export const joinConnectEvent = (dispatch: (value: VoterLoginAction) => void): (() => void) => {
    return function connectEvent() {
        dispatch({ type: 'isLoading', payload: false })
        dispatch({ type: 'hideMessage' })
    }
}

export const joinConnectErrorEvent = (
    dispatch: (value: VoterLoginAction) => void,
    t: TFunction<string[]>,
): (() => void) => {
    return function p() {
        dispatch({
            type: 'showMessage',
            payload: { label: t('common:Unable to connect to server'), alertLevel: 'error' },
        })
    }
}

interface IJoinVerifiedData {
    token: string
    verificationSocketId: string
}
export const joinVerifiedEvent = (
    socket: AnoSocket,
    history: H.History,
    appStateDispatcher: IAppStateDispatcher,
): EventExecutor<IJoinVerifiedData> => {
    console.log('verified event init')

    return WebsocketEvent<IJoinVerifiedData>({
        dataHandler: (data) => {
            socket.emit(Events.client.auth.voterVerifiedReceived, data.verificationSocketId)
            const localStorageService = new LocalStorageService<StorageKeys>()
            localStorageService.setItem('ACCESS_TOKEN', data.token)
            appStateDispatcher.setLoginState(AuthLevel.voter)
            history.replace(getVoterRoute().election)
        },
    })
}

export const joinAckEvent = (
    dispatch: (value: VoterLoginAction) => void,
    t: TFunction<string[]>,
): EventExecutor<unknown> => {
    return WebsocketEvent({
        dataHandler: () => {
            dispatch({
                type: 'showMessage',
                payload: {
                    label: t('voter:Verification link sent to your', { type: t('common:Email').toLowerCase() }),
                    alertMessage: t('voter:Please do not close this window'),
                    alertLevel: 'success',
                },
            })
        },
        errorHandler: (error) => {
            const { code } = error
            let label = t('voter:Voter verification failed')
            switch (code) {
                case ErrorCode.alreadyVerified:
                    label = t('voter:Already verified')
                    break
                case ErrorCode.voterNotExist:
                    label = t('voter:Identification not exist')
                    break
                case ErrorCode.electionNotExist:
                    label = t('election:Not exist')
                    break
                case ErrorCode.electionFinished:
                    label = t('election:Is finished')
                    break
                case ErrorCode.electionCodeMissing:
                    label = t('voter:Missing election code')
                    break
                case ErrorCode.voterIdentificationMissing:
                    label = t('voter:Missing identification')
                    break
            }
            dispatch({
                type: 'showMessage',
                payload: { label: label, alertLevel: 'error' },
            })
        },
    })
}
