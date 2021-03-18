import { Col, Row } from 'antd'
import Title from 'antd/lib/typography/Title'
import BallotsQueue from 'components/queue/BallotsQueue'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import { IElection } from 'core/models/IElection'
import { useSocket } from 'core/state/websocket/useSocketHook'
import React, { ReactElement, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ElectionStatusCard } from './election/ElectionStatusCard'

export function ElectionInProgressView({ election }: { election: IElection }): ReactElement {
    const [socket] = useSocket()
    const [t] = useTranslation('common')

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
                    <Title level={1}>{election.title}</Title>
                    <ElectionStatusCard election={election} />
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
