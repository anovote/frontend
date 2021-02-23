import { Layout, Menu } from 'antd'
import { EyeFilled, HomeFilled, SettingFilled, ProjectFilled } from '@ant-design/icons'
const { Header, Content, Sider } = Layout
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useHistory } from 'react-router-dom'
import { ReactComponent as AnovoteLogo } from '../style/assets/anovote-logo.svg'
import Search from 'antd/lib/input/Search'

/**
 * Skeleton component for application
 */
function Skeleton(props: { content: ReactElement }): ReactElement {
    const [t] = useTranslation(['common'])
    const history = useHistory()

    function toProfile() {
        history.push('/profile')
    }
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
                <Sider className="skeleton-sidebar">
                    <AnovoteLogo id="logo" />
                    <Menu className="sidebar-menu" mode="vertical" defaultSelectedKeys={['1']}>
                        <div id="create-election" tabIndex={2}>
                            Create Election
                        </div>
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
                        <div id="view-profile" tabIndex={6}>
                            Profile
                        </div>
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
