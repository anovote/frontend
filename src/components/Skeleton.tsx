import { EyeFilled, HomeFilled, ProjectFilled, SettingFilled } from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import Search from 'antd/lib/input/Search'
import ProfileSettingsModal from 'containers/modal/ProfileSettingsModal'
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

    const closeProfileModalHandler = () => setProfileModalState(false)
    const openProfileModal = () => setProfileModalState(true)
    function createElection() {
        history.push('/create-election')
    }
    function onSearch() {
        console.log('Tried to search')
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
                    <Menu className="sidebar-menu" mode="vertical" defaultSelectedKeys={['1']}>
                        <LargeIconButton
                            text={t('Create Election')}
                            onClick={createElection}
                            tabIndex={2}
                            classId="create-election"
                        >
                            <CirclePlusIcon />
                        </LargeIconButton>
                        <Menu.Item key="1" icon={<HomeFilled />}>
                            <Link to="/" tabIndex={3} id="dashboard">
                                {t('Dashboard')}
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="2" icon={<ProjectFilled />}>
                            <Link to="/elections" tabIndex={4} id="elections">
                                {t('Elections')}
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="3" icon={<EyeFilled />}>
                            <Link to="/customize" tabIndex={5}>
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
                        <Menu.Item key="4" icon={<SettingFilled />} id="settings">
                            <Link to="/Settings" tabIndex={7}>
                                {t('Settings')}
                            </Link>
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
