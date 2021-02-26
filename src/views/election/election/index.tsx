import {
    ClockCircleOutlined,
    ForwardOutlined,
    LockOutlined,
    SafetyOutlined,
    SecurityScanOutlined,
    UnlockOutlined,
} from '@ant-design/icons'
import { AlertProps, Card, Col, List, Row } from 'antd'
import Title from 'antd/lib/typography/Title'
import * as React from 'react'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface ElectionStatus {
    openDate: Date
    closeDate: Date
    timeElapsed: Date
    ballotProcessMode: number
    authenticationMethod: string
    electionPassword: string
}
interface StatusDetail {
    icon: ReactNode
    colorClass: string
    title: string
    text: string
}
/**
 * The main view used for creating an election
 */
export default function ElectionView(): React.ReactElement {
    const [t] = useTranslation(['translation', 'common', 'election'])
    const [alertProps, setAlertProps] = React.useState<AlertProps>()
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
            text: '0D 13H 37M 00S',
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
    return (
        <Row>
            <Col span={12}>
                <Card className="election-card">
                    <List
                        className="election-card-list"
                        header={header}
                        dataSource={details}
                        renderItem={(detail) => (
                            <List.Item className={'justify-content-start'}>
                                <div className="status-icon-spacer">
                                    <span className={`${detail.colorClass} circle-center-content`}>{detail.icon}</span>
                                </div>
                                <div className={'e'}>
                                    <div className={'text-label'}>{detail.title}</div>
                                    <div className={'text'}>{detail.text}</div>
                                </div>
                            </List.Item>
                        )}
                    />
                </Card>
                <Card className={'election-card'}>
                    <div className="is-flex-column">
                        <span className={'text-subtitle'}>{t('common:Connected')}</span>
                        <span className={'text-large'}>1337</span>
                    </div>
                </Card>
            </Col>
            <Col span={12}>col-12</Col>
        </Row>
    )
}
