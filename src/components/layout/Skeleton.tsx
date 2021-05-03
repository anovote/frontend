import { LogoutOutlined, MenuOutlined, ProjectFilled } from '@ant-design/icons'
import { Button, Drawer, Layout, Menu } from 'antd'
import CirclePlusIcon from 'components/icons/CirclePlusIcon'
import ProfileRoundIcon from 'components/icons/ProfileRoundIcon'
import LargeIconButton from 'containers/button/LargeIconbutton'
import ProfileSettingsModal from 'containers/modal/ProfileSettingsModal'
import { BackendAPI } from 'core/api'
import useMessage from 'core/hooks/useMessage'
import { IElectionOrganizerEntity } from 'core/models/electionOrganizer/IElectionOrganizerEntity'
import { getAdminRoute, getPublicRoute } from 'core/routes/siteRoutes'
import { ElectionOrganizerService } from 'core/service/electionOrganizer/ElectionOrganizerService'
import { useAppStateDispatcher } from 'core/state/app/AppStateContext'
import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useHistory } from 'react-router-dom'
import { ReactComponent as AnovoteLogo } from 'style/assets/anovote-logo.svg'
const { Content, Sider } = Layout

/**
 * Skeleton component for application
 */
function Skeleton(props: { content: ReactElement }): ReactElement {
    const [t] = useTranslation(['common'])
    const history = useHistory()
    const dispatcher = useAppStateDispatcher()
    const [showProfileModal, setProfileModalState] = useState(false)
    const [organizer, setOrganizer] = useState<IElectionOrganizerEntity>({} as IElectionOrganizerEntity)
    const { info, loading } = useMessage()
    const closeProfileModalHandler = () => setProfileModalState(false)
    const openProfileModal = () => setProfileModalState(true)
    const [showSidebar, setShowSidebar] = useState(true)
    const [isDesktop, setIsDesktop] = useState(true)
    const [width, setWidth] = React.useState(window.innerWidth)
    const layoutSwitchWidth = 900

    const { /* dashboard,*/ elections /*, customize, settings*/ } = getAdminRoute()

    const setWindowWidth = () => {
        setWidth(window.innerWidth)
    }

    useEffect(() => {
        if (isDesktop && width < layoutSwitchWidth) {
            setIsDesktop(false)
            setShowSidebar(false)
        } else if (!isDesktop && width >= layoutSwitchWidth) {
            setIsDesktop(true)
            setShowSidebar(true)
        }
    }, [width])
    useEffect(() => {
        if (width >= layoutSwitchWidth) {
            setIsDesktop(true)
        }
        window.addEventListener('resize', setWindowWidth)
        return () => window.removeEventListener('resize', setWindowWidth)
    }, [])
    function createElection() {
        history.push(elections.create)
    }

    useEffect(() => {
        fetchOrganizer()
    }, [])

    const fetchOrganizer = useCallback(async () => {
        const electionOrganizerService = new ElectionOrganizerService(BackendAPI)
        try {
            const organizer = await electionOrganizerService.fetchOrganizer()
            if (organizer) setOrganizer(organizer)
        } catch (error) {
            const organizer = {
                firstName: t('common:Your'),
                lastName: t('common:Name'),
                email: 'example@mail.com',
            } as IElectionOrganizerEntity
            setOrganizer(organizer)
        }
    }, [organizer])

    // todo #161
    //function onSearch() {
    //    console.log('Tried to search')
    //}

    const logoutHandler = () => {
        loading({
            content: t('common:Attempting to log out'),
            duration: 0.5,
            key: 'logout',
        })
            .then(() => {
                dispatcher.setLogoutState()
                history.push(getPublicRoute().login)
            })
            .then(() =>
                info({
                    content: t('common:You are now logged out'),
                    key: 'logout',
                }),
            )
    }

    const sider = (
        <Sider className={`skeleton-sidebar ${showSidebar ? 'sidebar-toggled' : ''}`}>
            <Link to={elections.view}>
                <AnovoteLogo id="logo" />
            </Link>
            <Menu
                className="sidebar-menu"
                mode="vertical"
                defaultSelectedKeys={[history.location.pathname]}
                selectedKeys={[history.location.pathname]}
            >
                <LargeIconButton
                    text={t('Create election')}
                    onClick={createElection}
                    tabIndex={2}
                    classId="create-election"
                >
                    <CirclePlusIcon />
                </LargeIconButton>
                {/* todo #151 implement missing links */}
                {/*<Menu.Item key={dashboard} icon={<HomeFilled />}>
                            <Link to={dashboard} tabIndex={3} id="dashboard">
                                {t('Dashboard')}
                            </Link>
                        </Menu.Item>*/}
                <Menu.Item key={elections.view} icon={<ProjectFilled />}>
                    <Link to={elections.view} tabIndex={4} id="elections">
                        {t('Elections')}
                    </Link>
                </Menu.Item>
                {/*<Menu.Item key={customize} icon={<EyeFilled />}>
                            <Link to={customize} tabIndex={5}>
                                {t('Customize')}
                            </Link>
                        </Menu.Item>*/}
                <LargeIconButton
                    classId="view-profile"
                    text={`${organizer.firstName} ${organizer.lastName}`}
                    reverse={true}
                    onClick={openProfileModal}
                    tabIndex={6}
                >
                    <ProfileRoundIcon />
                </LargeIconButton>
                {/* todo #146 implement settings, the log out button may be a better permanent solution */}
                <Menu.Item key={'logout'} icon={<LogoutOutlined />} onClick={logoutHandler} id="log-out">
                    {t('common:Log out')}
                    {/*<Link to={settings} tabIndex={7}>
                                {t('Settings')}
                            </Link>*/}
                </Menu.Item>
            </Menu>
        </Sider>
    )
    return (
        <Layout>
            {/*<Header className="skeleton-header">*/}
            {/* TODO #161 make search do something
                <Search placeholder="Search something.." allowClear size="middle" onSearch={onSearch} tabIndex={1} />*/}
            {/*</Header>*/}
            <Button
                onClick={() => {
                    setShowSidebar(!showSidebar)
                }}
                className="hamburger-menu mt-10 ml-10"
            >
                <MenuOutlined />
            </Button>
            <Layout className="skeleton-layout">
                <ProfileSettingsModal
                    showModal={showProfileModal}
                    close={closeProfileModalHandler}
                    organizer={organizer}
                />
                {isDesktop && sider}
                {!isDesktop && (
                    <Drawer
                        placement="left"
                        className="skeleton-drawer"
                        mask={!isDesktop}
                        onClose={() => setShowSidebar(false)}
                        closable
                        //closeIcon={<LogoutOutlined></LogoutOutlined>}
                        visible={showSidebar}
                    >
                        {sider}
                    </Drawer>
                )}
                <Layout id="content">
                    <Content className="site-layout-background">{props.content}</Content>
                </Layout>
            </Layout>
        </Layout>
    )
}

export default Skeleton
