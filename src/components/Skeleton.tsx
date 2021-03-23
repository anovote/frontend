import { EyeFilled, HomeFilled, LogoutOutlined, ProjectFilled } from '@ant-design/icons'
import { AlertProps, Layout, Menu } from 'antd'
import Search from 'antd/lib/input/Search'
import ProfileSettingsModal from 'containers/modal/ProfileSettingsModal'
import { BackendAPI } from 'core/api'
import { getAdminRoute, getPublicRoute } from 'core/routes/siteRoutes'
import { AuthenticationService } from 'core/service/authentication/AuthenticationService'
import { LocalStorageService } from 'core/service/storage/LocalStorageService'
import { AlertState } from 'core/state/AlertState'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useHistory } from 'react-router-dom'
import LargeIconButton from '../containers/button/LargeIconbutton'
import { ReactComponent as AnovoteLogo } from '../style/assets/anovote-logo.svg'
import CirclePlusIcon from './icons/CirclePlusIcon'
import ProfileRoundIcon from './icons/ProfileRoundIcon'
const { Header, Content, Sider } = Layout

/**
 * Skeleton component for application
 */
function Skeleton(props: { content: ReactElement }): ReactElement {
    const [t] = useTranslation(['common'])
    const history = useHistory()
    const [showProfileModal, setProfileModalState] = useState(false)

    const alertHistory = useHistory<AlertState>()

    const closeProfileModalHandler = () => setProfileModalState(false)
    const openProfileModal = () => setProfileModalState(true)

    const { dashboard, elections, customize /*, settings*/ } = getAdminRoute()

    function createElection() {
        history.push(elections.create)
    }
    function onSearch() {
        console.log('Tried to search')
    }

    const logoutHandler = () => {
        new AuthenticationService(BackendAPI, new LocalStorageService()).logout()
        const alert: AlertProps = { message: 'You where logged out', closable: true, type: 'info', showIcon: true }
        alertHistory.push(getPublicRoute().login, { alertProps: alert })
    }

    return (
        <Layout>
            <Header className="skeleton-header">
                <Search placeholder="Search something.." allowClear size="middle" onSearch={onSearch} tabIndex={1} />
            </Header>
            <Layout>
                <ProfileSettingsModal showModal={showProfileModal} close={closeProfileModalHandler} />
                <Sider className="skeleton-sidebar">
                    <AnovoteLogo id="logo" />
                    <Menu className="sidebar-menu" mode="vertical" defaultSelectedKeys={[history.location.pathname]}>
                        <LargeIconButton
                            text={t('Create election')}
                            onClick={createElection}
                            tabIndex={2}
                            classId="create-election"
                        >
                            <CirclePlusIcon />
                        </LargeIconButton>
                        <Menu.Item key={dashboard} icon={<HomeFilled />}>
                            <Link to={dashboard} tabIndex={3} id="dashboard">
                                {t('Dashboard')}
                            </Link>
                        </Menu.Item>
                        <Menu.Item key={elections.view} icon={<ProjectFilled />}>
                            <Link to={elections.view} tabIndex={4} id="elections">
                                {t('Elections')}
                            </Link>
                        </Menu.Item>
                        <Menu.Item key={customize} icon={<EyeFilled />}>
                            <Link to={customize} tabIndex={5}>
                                {t('Customize')}
                            </Link>
                        </Menu.Item>
                        <LargeIconButton
                            classId="view-profile"
                            text="Name for you"
                            reverse={true}
                            onClick={openProfileModal}
                            tabIndex={6}
                        >
                            <ProfileRoundIcon />
                        </LargeIconButton>
                        {/* todo #146 implement settings */}
                        <Menu.Item key={'logout'} icon={<LogoutOutlined />} onClick={logoutHandler} id="settings">
                            {t('common:Log out')}
                            {/*<Link to={settings} tabIndex={7}>
                                {t('Settings')}
                            </Link>*/}
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout id="content">
                    <Content className="site-layout-background">{props.content}</Content>
                </Layout>
            </Layout>
        </Layout>
    )
}

export default Skeleton
