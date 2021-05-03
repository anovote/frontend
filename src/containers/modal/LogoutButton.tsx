import { LogoutOutlined } from '@ant-design/icons'
import { Button, Modal } from 'antd'
import { AlertState } from 'core/hooks/useAlert'
import useMessage from 'core/hooks/useMessage'
import { getPublicRoute } from 'core/routes/siteRoutes'
import { useAppStateDispatcher } from 'core/state/app/AppStateContext'
import React, { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'

export function LogoutButton({ confirmation }: LogoutButtonProps): ReactElement {
    const history = useHistory<AlertState>()
    const dispatcher = useAppStateDispatcher()
    const { confirm } = Modal
    const { loading, info } = useMessage()

    const [t] = useTranslation('common')
    const logoutHandler = async () => {
        if (!confirmation) {
            logout()
            return
        }
        confirm({
            ...confirmation,
            onOk: logout,
            okText: t('common:Log out'),
            cancelText: t('common:Cancel'),
            okType: 'danger',
            closable: true,
        })
    }

    const logout = () => {
        loading({
            content: t('common:Attempting to log out'),
            duration: 0.5,
            key: 'logout',
        })
            .then(() => {
                dispatcher.setLogoutState()
                history.push(confirmation ? getPublicRoute().joinElection : getPublicRoute().login)
            })
            .then(() =>
                info({
                    content: t('common:You are now logged out'),
                    key: 'logout',
                }),
            )
    }

    return (
        <Button className={'logout-btn'} onClick={logoutHandler}>
            <LogoutOutlined />
            {t('common:Log out')}
        </Button>
    )
}

interface LogoutButtonProps {
    confirmation?: {
        title: string
        content: ReactNode
        okText?: string
        cancelText?: string
    }
}
