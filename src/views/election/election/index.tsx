import { Card, Col, Row, Space } from 'antd'
import Title from 'antd/lib/typography/Title'
import { ElectionStatus } from 'core/models/election/ElectionStatus'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import CreateElectionView from '../createElection'
import { ElectionInProgressView } from '../ElectionInProgressView'
import { elections } from '../../../dummy/electionsDummyData'
import { ElectionStatusCard } from './ElectionStatusCard'

/**
 * The main view used for creating an election
 */
export default function ElectionView(): React.ReactElement {
    const [t] = useTranslation(['translation', 'common', 'election'])
    const election = elections[0]

    const renderElectionView = (electionStatus: ElectionStatus) => {
        switch (electionStatus) {
            case ElectionStatus.NotStarted:
                return <CreateElectionView initialElection={election} />
            case ElectionStatus.Started:
                return <ElectionInProgressView election={election} />
            case ElectionStatus.Finished:
                return 'Election finished'
            default:
                return null
        }
    }

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
                <Col span={16}>{renderElectionView(election.status)}</Col>
            </Row>
        </>
    )
}
