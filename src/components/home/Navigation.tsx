import { ArrowDownOutlined, MenuOutlined } from '@ant-design/icons'
import { Button, Drawer, Menu } from 'antd'
import { getPublicRoute } from 'core/routes/siteRoutes'
import React, { KeyboardEvent, KeyboardEventHandler, MouseEventHandler, ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useHistory } from 'react-router-dom'
import { ReactComponent as AnovoteLogo } from 'style/assets/anovote-logo.svg'
import { ReactComponent as PurpleLine } from 'style/assets/purple-line.svg'

export default function Navigation(): ReactElement {
    const [t] = useTranslation(['navigation', 'common'])
    const history = useHistory()
    const { landing, about, joinElection, login, register } = getPublicRoute()
    const [isVisible, setIsVisible] = useState(false)

    const routeOnEnter = (e: KeyboardEvent<HTMLLIElement>, route: string) => {
        if (e.key === 'Enter') history.push(route)
    }

    const routeOnClickAndEnter = (route: string) => {
        return {
            onClick: () => history.push(route),
            onKeyUp: (e: KeyboardEvent<HTMLLIElement>) => routeOnEnter(e, route),
        }
    }

    return (
        <>
            <Link to={landing} id="logo-link">
                <AnovoteLogo id="logo" />
            </Link>
            <Menu mode="horizontal" selectedKeys={[history.location.pathname]} className="wide-menu">
                <Menu.Item key={about} {...routeOnClickAndEnter(about)}>
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
            <Button onClick={() => setIsVisible(true)} className="hamburger-menu">
                <MenuOutlined />
            </Button>
            <Drawer
                placement="bottom"
                closable
                closeIcon={<ArrowDownOutlined />}
                onClose={() => setIsVisible(false)}
                visible={isVisible}
                className="responsive-menu"
                title="Menu"
            >
                <Menu mode="vertical" selectedKeys={[history.location.pathname]}>
                    <Menu.Item key={landing} {...routeOnClickAndEnter(landing)} tabIndex={1}>
                        {t('navigation:Home')}
                    </Menu.Item>
                    <Menu.Item key={about} {...routeOnClickAndEnter(about)} tabIndex={2}>
                        {t('navigation:About')}
                    </Menu.Item>
                    <Menu.ItemGroup title={t('navigation:For voter')}>
                        <Menu.Item key={joinElection} {...routeOnClickAndEnter(joinElection)} tabIndex={3}>
                            {t('navigation:Join')}
                        </Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.ItemGroup title={t('navigation:For election organizer')}>
                        <Menu.Item key={login} tabIndex={4} {...routeOnClickAndEnter(login)}>
                            {t('navigation:Login')}
                        </Menu.Item>
                        <Menu.Item key={register} {...routeOnClickAndEnter(register)} tabIndex={5}>
                            {t('navigation:Register')}
                        </Menu.Item>
                    </Menu.ItemGroup>
                </Menu>
                <PurpleLine id="line-responsive" />
            </Drawer>
        </>
    )
}
