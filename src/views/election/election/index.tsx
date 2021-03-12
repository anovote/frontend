import { Card, Col, Row, Space } from 'antd'
import Title from 'antd/lib/typography/Title'
import { ElectionStatus } from 'core/models/ElectionStatus'
import { IElection } from 'core/models/IElection'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { ElectionInProgressView } from '../ElectionInProgressView'
import { ElectionStatusCard } from './ElectionStatusCard'

const elections: IElection[] = [
    {
        id: 1,
        electionOrganizer: 1,
        description: 'Very nice voting',
        title: 'My election',
        isAutomatic: false,
        status: ElectionStatus.Started,
        isLocked: false,
    },
]

/**
 * The main view used for creating an election
 */
export default function ElectionView(): React.ReactElement {
    const [t] = useTranslation(['translation', 'common', 'election'])
    const election = elections[0]

    const cardTitle = <Title level={2}>{t('election:Connected voters')}</Title>
    return (
        <>
            <Row>
                <Col>
                    <Space direction={'vertical'}>
                        <ElectionStatusCard election={elections[0]} />
                        <Card className={'info-card'} title={cardTitle}>
                            <div className="is-flex-column has-content-center-center">
                                <span className={'text-large'}>1337</span> {/* todo fetch real time*/}
                            </div>
                        </Card>
                    </Space>
                </Col>
                <Col span={12}>{election.status === ElectionStatus.Started && <ElectionInProgressView />}</Col>
            </Row>
        </>
    )
}
