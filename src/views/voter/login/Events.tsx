import { ErrorCodeResolver } from 'core/error/ErrorCodeResolver'
import { Events } from 'core/events'
import { getVoterRoute } from 'core/routes/siteRoutes'
import { AuthLevel } from 'core/service/authentication/AuthLevel'
import { IStorage } from 'core/service/storage/IStorage'
import { StorageKeys } from 'core/service/storage/StorageKeys'
import { EventExecutor, WebsocketEvent } from 'core/socket/EventHandler'
import { IAppStateDispatcher } from 'core/state/app/AppStateContext'
import { AnoSocket } from 'core/state/websocket/IAnoSocket'
import * as H from 'history'
import { TFunction } from 'react-i18next'
import { VoterLoginAction } from 'core/state/login/VoterLoginState'

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
    return function connectErrorEvent() {
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
    storageService: IStorage<StorageKeys>,
): EventExecutor<IJoinVerifiedData> => {
    return WebsocketEvent<IJoinVerifiedData>({
        dataHandler: (data) => {
            // Send verification received event to server so it can rebroadcast to the verification page
            socket.emit(Events.client.auth.voterVerifiedReceived, data.verificationSocketId)
            storageService.setItem('ACCESS_TOKEN', data.token)
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
            const errorCodeResolver = new ErrorCodeResolver(t)
            const label = errorCodeResolver.resolve(code)
            dispatch({
                type: 'showMessage',
                payload: { label: label, alertLevel: 'error' },
            })
        },
    })
}
