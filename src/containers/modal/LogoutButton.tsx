import { AlertProps, Button } from 'antd'
import { BackendAPI } from 'core/api'
import { getPublicRoute } from 'core/routes/siteRoutes'
import { AuthenticationService } from 'core/service/authentication/AuthenticationService'
import { LocalStorageService } from 'core/service/storage/LocalStorageService'
import { AlertState } from 'core/state/AlertState'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'

export function LogoutButton(): ReactElement {
    const history = useHistory<AlertState>()

    const [t] = useTranslation()
    const logoutHandler = () => {
        console.log('')
        new AuthenticationService(BackendAPI, new LocalStorageService()).logout()
        const alert: AlertProps = { message: 'You where logged out', closable: true, type: 'info', showIcon: true }
        history.push(getPublicRoute().login, { alertProps: alert })
    }
    return (
        <Button className="logout-btn" onClick={logoutHandler}>
            {t('common:Log out')}
        </Button>
    )
}
