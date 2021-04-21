import { LogoutOutlined } from '@ant-design/icons'
import { Button, Modal } from 'antd'
import { AlertState } from 'core/hooks/useAlert'
import { getPublicRoute } from 'core/routes/siteRoutes'
import { useAppStateDispatcher } from 'core/state/app/AppStateContext'
import React, { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'

export function LogoutButton({ confirmProps }: LogoutButtonProps): ReactElement {
    const history = useHistory<AlertState>()
    const dispatcher = useAppStateDispatcher()
    const { confirm } = Modal

    const [t] = useTranslation('common')
    const logoutHandler = async () => {
        if (!confirmProps) {
            logout()
            return
        }
        console.log('here')
        confirm({
            ...confirmProps,
            onOk: logout,
            okText: t('common:Log out'),
            cancelText: t('common:Cancel'),
            okType: 'danger',
            closable: true,
        })
    }

    const logout = () => {
        const alert: AlertState = { message: t('common:You where logged out'), level: 'info' }
        dispatcher.setLogoutState()
        history.push(confirmProps ? confirmProps.redirectTo : getPublicRoute().login, alert)
    }

    return (
        <Button className={'logout-btn'} onClick={logoutHandler}>
            <LogoutOutlined />
            {t('common:Log out')}
        </Button>
    )
}

interface LogoutButtonProps {
    //confirm?: () => Promise<void>
    confirmProps?: {
        title: string
        content: ReactNode
        okText?: string
        cancelText?: string
        redirectTo: string
    }
}
