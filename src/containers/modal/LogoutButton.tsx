import { AlertProps, Button } from 'antd'
import { getPublicRoute } from 'core/routes/siteRoutes'
import { AlertState } from 'core/state/AlertState'
import { useAppStateDispatcher } from 'core/state/app/AppStateContext'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'

export function LogoutButton(): ReactElement {
    const history = useHistory<AlertState>()
    const dispatcher = useAppStateDispatcher()

    const [t] = useTranslation()
    const logoutHandler = () => {
        const alert: AlertProps = { message: 'You where logged out', closable: true, type: 'info', showIcon: true }
        dispatcher.setLogoutState()
        history.push(getPublicRoute().login, { alertProps: alert })
    }
    return (
        <Button className="logout-btn" onClick={logoutHandler}>
            {t('common:Log out')}
        </Button>
    )
}
