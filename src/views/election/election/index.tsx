import {
    ClockCircleOutlined,
    ForwardOutlined,
    LockOutlined,
    SafetyOutlined,
    SecurityScanOutlined,
    UnlockOutlined,
} from '@ant-design/icons'
import { Card, Col, Row, Space } from 'antd'
import Item from 'antd/lib/list/Item'
import Title from 'antd/lib/typography/Title'
import CardList from 'components/cards/CardList'
import CountUpTimer from 'components/countUpTimer/countUpTimer'
import * as React from 'react'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
interface StatusDetail {
    icon: ReactNode
    colorClass: string
    title: string
    text: string | ReactNode
}
/**
 * The main view used for creating an election
 */
export default function ElectionView(): React.ReactElement {
    const [t] = useTranslation(['translation', 'common', 'election'])
    const header = (
        <div className="spread align-items-center">
            <Title level={2}>{t('common:Status')} </Title>
            <div className="">
                <span className="text-label">{t('common:Election')} ID # </span>
                <span className="text-medium">123456</span>
            </div>
        </div>
    )

    const details: Array<StatusDetail> = [
        {
            icon: <LockOutlined />,
            colorClass: 'success-light',
            title: t('election:Election open'),
            text: new Date().toLocaleDateString(),
        },
        {
            icon: <UnlockOutlined />,
            colorClass: 'danger-light',
            title: t('election:Election close'),
            text: new Date().toLocaleDateString(),
        },
        {
            icon: <ClockCircleOutlined />,
            colorClass: 'main-light',
            title: t('election:Time elapsed'),
            // TODO! implement logic to set timer on states from current election
            text: <CountUpTimer />,
        },
        {
            icon: <ForwardOutlined />,
            colorClass: 'main-light',
            title: t('election:Ballot proceed'),
            text: 'automatic',
        },
        {
            icon: <SecurityScanOutlined />,
            colorClass: 'main-light',
            title: t('election:Authentication method'),
            text: 'Feide, Google',
        },
        {
            icon: <SafetyOutlined />,
            colorClass: 'main-light',
            title: t('common:Password'),

            text: 'Anovote101!',
        },
    ]

    /**
     * Generates the list entry with correct elements.
     * @param item the election object to render in list
     */
    const render = (statusItem: StatusDetail) => {
        return (
            <Item className={'justify-content-start'}>
                <div className="status-icon-spacer">
                    <span className={`${statusItem.colorClass} circle-center-content`}>{statusItem.icon}</span>
                </div>
                <div className={'e'}>
                    <div className={'text-label'}>{statusItem.title}</div>
                    <div className={'text'}>{statusItem.text}</div>
                </div>
            </Item>
        )
    }
    const cardTitle = <Title level={2}>{t('election:Connected voters')}</Title>
    return (
        <Row>
            <Col span={12}>
                <Space direction={'vertical'}>
                    <CardList listHeader={header} list={details} renderItem={(item) => render(item)}></CardList>
                    <Card className={'info-card'} title={cardTitle}>
                        <div className="is-flex-column has-content-center-center">
                            <span className={'text-large'}>1337</span>
                        </div>
                    </Card>
                </Space>
            </Col>
            <Col span={12}>col-12</Col>
        </Row>
    )
}
