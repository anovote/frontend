import { LogoutOutlined, ProjectFilled } from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import ProfileSettingsModal from 'containers/modal/ProfileSettingsModal'
import { BackendAPI } from 'core/api'
import { AlertState } from 'core/hooks/useAlert'
import { IElectionOrganizerEntity } from 'core/models/electionOrganizer/IElectionOrganizerEntity'
import { getAdminRoute, getPublicRoute } from 'core/routes/siteRoutes'
import { ElectionOrganizerService } from 'core/service/electionOrganizer/ElectionOrganizerService'
import { useAppStateDispatcher } from 'core/state/app/AppStateContext'
import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useHistory } from 'react-router-dom'
import LargeIconButton from '../containers/button/LargeIconbutton'
import { ReactComponent as AnovoteLogo } from '../style/assets/anovote-logo.svg'
import CirclePlusIcon from './icons/CirclePlusIcon'
import ProfileRoundIcon from './icons/ProfileRoundIcon'
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

    const closeProfileModalHandler = () => setProfileModalState(false)
    const openProfileModal = () => setProfileModalState(true)

    const { /* dashboard,*/ elections /*, customize, settings*/ } = getAdminRoute()

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
        const alert: AlertState = { message: 'You where logged out', level: 'info' } // todo temporary until new alert hooks comes
        dispatcher.setLogoutState()
        history.push(getPublicRoute().login, alert)
    }

    return (
        <Layout>
            {/*<Header className="skeleton-header">*/}
            {/* TODO #161 make search do something
                <Search placeholder="Search something.." allowClear size="middle" onSearch={onSearch} tabIndex={1} />*/}
            {/*</Header>*/}
            <Layout className="skeleton-layout">
                <ProfileSettingsModal
                    showModal={showProfileModal}
                    close={closeProfileModalHandler}
                    organizer={organizer}
                />
                <Sider className="skeleton-sidebar">
                    <Link to={elections.view}>
                        <AnovoteLogo id="logo" />
                    </Link>
                    <Menu className="sidebar-menu" mode="vertical" defaultSelectedKeys={[history.location.pathname]}>
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
                <Layout id="content">
                    <Content className="site-layout-background">{props.content}</Content>
                </Layout>
            </Layout>
        </Layout>
    )
}

export default Skeleton
