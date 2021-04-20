import { CloseOutlined } from '@ant-design/icons'
import { Col, Divider, Row, Space } from 'antd'
import { Gutter } from 'antd/lib/grid/row'
import Title from 'antd/lib/typography/Title'
import { ElectionStatusCard } from 'components/election/ElectionStatusCard'
import ElectionStatusLabel from 'components/ElectionStatusLabel'
import CloseElectionIcon from 'components/icons/CloseElectionIcon'
import BallotsQueue from 'components/queue/BallotsQueue'
import IconButton from 'containers/button/IconButton'
import BallotModal from 'containers/modal/BallotModal'
import { Events } from 'core/events'
import { useSocket } from 'core/hooks/useSocket'
import { BallotEntity } from 'core/models/ballot/BallotEntity'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import { IBallotStats } from 'core/models/ballot/IBallotStats'
import { IElectionEntity } from 'core/models/election/IElectionEntity'
import { LocalStorageService } from 'core/service/storage/LocalStorageService'
import { StorageKeys } from 'core/service/storage/StorageKeys'
import { WebsocketEvent } from 'core/socket/EventHandler'
import { AnoSocket } from 'core/state/websocket/IAnoSocket'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TupleType } from 'typescript'
import { fetchElectionStats } from '../../core/helpers/fetchElectionStats'
import { ConnectedVoters } from './ConnectedVoters'
const authEvent = (socket: AnoSocket, electionId: number) => {
    return WebsocketEvent({
        dataHandler: () => {
            socket.emit(Events.client.election.administrate, { electionId: electionId })
        },
        errorHandler: (error) => {
            console.log(error)
        },
    })
}

export function ElectionInProgressView({ election }: { election: IElectionEntity }): ReactElement {
    const [socket] = useSocket()
    const [t] = useTranslation(['common', 'election'])
    const [modal, setModal] = useState(false)
    const [active, setActive] = useState(0)
    const [stats, setStats] = useState([] as IBallotStats[])

    useEffect(() => {
        const storageService = new LocalStorageService<StorageKeys>()
        fetchElectionStats(election.id)
            .then((serverStats) => {
                setStats(serverStats)
            })
            .catch((err) => {
                console.log(err)
            })

        socket.connect()

        socket.on(Events.standard.socket.connect, () => {
            socket.emit(
                Events.client.auth.withToken,
                { token: 'Bearer: ' + storageService.getItem('ACCESS_TOKEN') },
                authEvent(socket, election.id),
            )
        })

        socket.on(Events.server.vote.newVote, (data: IBallotStats) => {
            const newState = [...stats]
            newState[data.ballotId] = data

            setStats(newState)
        })
        return () => {
            socket.disconnect()
        }
    }, [])

    const ballots = election.ballots
        ? election.ballots.map((ballot) => ({ ...ballot } as IBallotEntity))
        : new Array<IBallotEntity>()

    /**
     * Display modal for a given ballot with id.
     * @param id the id to show modal for
     */
    const showModal = (id: number) => {
        setModal(true)
        setActive(id)
    }

    const closeModal = () => {
        setModal(false)
    }

    const hasNext = () => {
        if (ballots[active + 1]) {
            setActive(active + 1)
        }
    }

    const hasPrevious = () => {
        if (ballots[active - 1]) {
            setActive(active - 1)
        }
    }

    const findBallotWithId = (id: number) => {
        const ballot = ballots.find((ballot) => ballot.id === id)
        if (!ballot) return undefined
        return new BallotEntity(ballot)
    }

    const getBallotStats = (ballotId: number): IBallotStats | undefined => {
        return stats.find((stat) => stat.ballotId === ballotId)
    }

    return (
        <>
            <Row justify="space-between" align="middle">
                <Col>
                    <Title level={1}>{election.title}</Title>
                </Col>
                <Col>
                    <ElectionStatusLabel status={election.status} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <IconButton
                        icon={<CloseElectionIcon />}
                        text="Close Election"
                        onClick={() => console.log('aaa')}
                        color="red"
                    />
                </Col>
            </Row>
            <Divider />
            <Row wrap={true} justify="start" gutter={[64, 32]}>
                <Col flex="none">
                    <Space size={16} direction="vertical">
                        <ElectionStatusCard election={election} />
                        <ConnectedVoters />
                    </Space>
                </Col>
                <Col flex="auto">
                    <Title level={2}>{t('common:Ballots')}</Title>
                    {ballots.length > 0 ? (
                        <>
                            <BallotsQueue dataSource={ballots} stats={stats} expandBallot={showModal} />
                            <BallotModal
                                showModal={modal}
                                ballotEntity={findBallotWithId(active)}
                                ballotStats={getBallotStats(active)}
                                close={closeModal}
                                controls={{
                                    next: () => {
                                        // todo #189 fix these next/prev buttons
                                        hasNext()
                                    },
                                    previous: () => {
                                        hasPrevious()
                                    },
                                }}
                            />
                        </>
                    ) : (
                        <div>No ballots! should this even be allowed</div>
                    )}
                </Col>
            </Row>
        </>
    )
}
