import {
    ClockCircleOutlined,
    ForwardOutlined,
    LockOutlined,
    SafetyOutlined,
    SecurityScanOutlined,
    UnlockOutlined,
} from '@ant-design/icons'
import { Card, Col, Row, Space } from 'antd'
import Title from 'antd/lib/typography/Title'
import CardList from 'components/cards/CardList'
import CountUpTimer from 'components/countUpTimer/countUpTimer'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { IStatusDetail } from './IStatusDetail'
import StatusListItem from './StatusListItem'
/**
 * The main view used for creating an election
 */
export default function ElectionView(): React.ReactElement {
    const [t] = useTranslation(['translation', 'common', 'election'])
    const header = (
        <div className="spread align-items-center">
            <Title level={2}>{t('common:Status')} </Title>
            <div className="">
                <span className="text-label">{t('common:Election').toUpperCase()} ID # </span>
                <span className="text-medium">123456</span>
            </div>
        </div>
    )

    const details: Array<IStatusDetail> = [
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

    const cardTitle = <Title level={2}>{t('election:Connected voters')}</Title>
    return (
        <Row>
            <Col span={12}>
                <Space direction={'vertical'}>
                    <CardList listHeader={header} list={details} renderItem={(item) => StatusListItem(item)}></CardList>
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
