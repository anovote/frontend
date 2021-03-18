import { Card, Col, Row, Space } from 'antd'
import Title from 'antd/lib/typography/Title'
import BallotsQueue from 'components/queue/BallotsQueue'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import React, { ReactElement, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ElectionStatusCard } from 'components/election/ElectionStatusCard'
import { useSocket } from 'core/hooks/useSocket'
import { IElection } from 'core/models/election/IElectionEntity'

export function ElectionInProgressView({ election }: { election: IElection }): ReactElement {
    const [socket] = useSocket()
    const [t] = useTranslation(['common', 'election'])

    useEffect(() => {
        socket.connect()

        socket.on('connection', () => {
            console.log(socket.id)
        })
        return () => {
            socket.disconnect()
        }
    }, [socket])

    const ballots = election.ballots
        ? election.ballots.map((ballot, index) => ({ id: index, ...ballot } as IBallotEntity))
        : new Array<IBallotEntity>()

    return (
        <>
            <Row gutter={16}>
                <Col>
                    <Space direction="vertical">
                        <Title level={1}>{election.title}</Title>
                        <ElectionStatusCard election={election} />
                        <Card className={'info-card'} title={<Title level={2}>{t('election:Connected voters')}</Title>}>
                            <div className="is-flex-column has-content-center-center">
                                <span className={'text-large'}>1337</span> {/* todo fetch real time*/}
                            </div>
                        </Card>
                    </Space>
                </Col>
                <Col>
                    <Title level={2}>{t('common:Ballots')}</Title>
                    {ballots.length > 0 ? (
                        <BallotsQueue dataSource={ballots} />
                    ) : (
                        <div>No ballots! should this even be allowed</div>
                    )}
                </Col>
            </Row>
        </>
    )
}
