import { Menu } from 'antd'
import { getPublicRoute } from 'core/routes/siteRoutes'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useHistory } from 'react-router-dom'
import { ReactComponent as AnovoteLogo } from 'style/assets/anovote-logo.svg'

export default function Navigation(): ReactElement {
    const [t] = useTranslation(['navigation', 'common'])
    const history = useHistory()
    const { landing, about, joinElection, login, register } = getPublicRoute()
    return (
        <>
            <Link to={landing}>
                <AnovoteLogo id="logo" />
            </Link>
            <Menu mode="horizontal" selectedKeys={[history.location.pathname]}>
                <Menu.Item key={about} onClick={() => history.push(about)}>
                    {t('navigation:About')}
                </Menu.Item>
                <Link to={joinElection} id="join">
                    {t('navigation:Join')}
                </Link>
                <Link to={login} id="login">
                    {t('navigation:Login')}
                </Link>
                <Link to={register} id="sign-up">
                    {`${t('common:or')} ${t('navigation:Sign up')}`}{' '}
                </Link>
            </Menu>
        </>
    )
}
