import { Button } from 'antd'
import { AlertState } from 'core/hooks/useAlert'
import { getPublicRoute } from 'core/routes/siteRoutes'
import { LogoutOutlined } from '@ant-design/icons'

import { BackendAPI } from 'core/api'

import { AuthenticationService } from 'core/service/authentication/AuthenticationService'
import { LocalStorageService } from 'core/service/storage/LocalStorageService'

import { useAppStateDispatcher } from 'core/state/app/AppStateContext'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'

export function LogoutButton(): ReactElement {
    const history = useHistory<AlertState>()
    const dispatcher = useAppStateDispatcher()

    const [t] = useTranslation()
    const logoutHandler = () => {
        const alert: AlertState = { message: 'You where logged out', level: 'info' }

        new AuthenticationService(BackendAPI, new LocalStorageService()).logout()

        dispatcher.setLogoutState()
        history.push(getPublicRoute().login, alert)
    }
    return (
        <Button className="logout-btn" onClick={logoutHandler} id="settings">
            <LogoutOutlined />
            {t('common:Log out')}
        </Button>
    )
}
