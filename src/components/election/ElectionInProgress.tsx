import { Card, Col, Row, Space } from 'antd'
import Title from 'antd/lib/typography/Title'
import { ElectionStatusCard } from 'components/election/ElectionStatusCard'
import BallotsQueue from 'components/queue/BallotsQueue'
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
    const [connectedVoters, setConnectedVoters] = useState<number>(0)

    useEffect(() => {
        const storageService = new LocalStorageService<StorageKeys>()
        socket.connect()

        console.log('in progress')
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
        console.log(id)
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

    socket.on(Events.server.election.voterConnected, (electionNum: number) => {
        if (electionNum == election.id) {
            let numConnectedVoters = connectedVoters
            numConnectedVoters++
            setConnectedVoters(numConnectedVoters)
        }
    })

    socket.on(Events.server.election.voterDisconnected, (electionNum: number) => {
        if (electionNum == election.id) {
            let numConnectedVoters = connectedVoters
            numConnectedVoters--
            setConnectedVoters(numConnectedVoters)
        }
    })

    return (
        <>
            <Row gutter={16}>
                <Col>
                    <Space direction="vertical">
                        <Title level={1}>{election.title}</Title>
                        <ElectionStatusCard election={election} />
                        <Card className={'info-card'} title={<Title level={2}>{t('election:Connected voters')}</Title>}>
                            <div className="is-flex-column has-content-center-center">
                                <span className={'text-large'}>{connectedVoters}</span> {/* todo fetch real time*/}
                            </div>
                        </Card>
                    </Space>
                </Col>
                <Col span={12}>
                    <Title level={2}>{t('common:Ballots')}</Title>
                    {ballots.length > 0 ? (
                        <>
                            <BallotsQueue dataSource={ballots} stats={stats} expandBallot={showModal} />
                            <BallotModal
                                showModal={modal}
                                ballotEntity={findBallotWithId(active)}
                                ballotStats={stats[active]}
                                close={closeModal}
                                controls={{
                                    next: () => {
                                        // todo fix these next/prev buttons
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
