import { Content } from 'antd/lib/layout/layout'
import * as React from 'react'
import { Form, Row, Col, Table, Alert, AlertProps, Card, List } from 'antd'

import { useTranslation } from 'react-i18next'
import Title from 'antd/lib/typography/Title'
import { ReactNode } from 'react'
import {
    ClockCircleFilled,
    ClockCircleOutlined,
    ForwardOutlined,
    LockFilled,
    LockOutlined,
    SafetyOutlined,
    SecurityScanOutlined,
    UnlockFilled,
    UnlockOutlined,
} from '@ant-design/icons'
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
    const [t] = useTranslation(['translation', 'common'])
    const [alertProps, setAlertProps] = React.useState<AlertProps>()
    const header = (
        <div className="spread align-items-center">
            <Title level={2}>Status </Title>
            <div className="">
                <span className="text-label">ELECTION ID # </span>
                <span className="text-medium">123456</span>
            </div>
        </div>
    )

    const details: Array<StatusDetail> = [
        {
            icon: <LockOutlined />,
            colorClass: 'success-light',
            title: 'Election opened',
            text: new Date().toLocaleDateString(),
        },
        {
            icon: <UnlockOutlined />,
            colorClass: 'danger-light',
            title: 'Election closes',
            text: new Date().toLocaleDateString(),
        },
        {
            icon: <ClockCircleOutlined />,
            colorClass: 'main-light',
            title: 'Time elapsed',
            text: '0D 13H 37M 00S',
        },
        {
            icon: <ForwardOutlined />,
            colorClass: 'main-light',
            title: 'Ballot proceed',
            text: 'automatic',
        },
        {
            icon: <SecurityScanOutlined />,
            colorClass: 'main-light',
            title: 'Authentication method',
            text: 'Feide, Google',
        },
        {
            icon: <SafetyOutlined />,
            colorClass: 'main-light',
            title: 'Password',
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
                                    <div className={'text-label mb-05'}>{detail.title}</div>
                                    <div className={'text'}>{detail.text}</div>
                                </div>
                            </List.Item>
                        )}
                    />
                </Card>
            </Col>
            <Col span={12}>col-12</Col>
        </Row>
    )
}
