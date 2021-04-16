import { Button } from 'antd'
import { AlertState } from 'core/hooks/useAlert'
import { getPublicRoute } from 'core/routes/siteRoutes'
import { useAppStateDispatcher } from 'core/state/app/AppStateContext'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'

export function LogoutButton(): ReactElement {
    const history = useHistory<AlertState>()
    const dispatcher = useAppStateDispatcher()

    const [t] = useTranslation()
    const logoutHandler = () => {
        const alert: AlertState = { message: 'You where logged out', alertType: 'info' }
        dispatcher.setLogoutState()
        history.push(getPublicRoute().login, alert)
    }
    return (
        <Button className="logout-btn" onClick={logoutHandler}>
            {t('common:Log out')}
        </Button>
    )
}
