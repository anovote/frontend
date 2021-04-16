import { Col, Row, Space } from 'antd'
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
import React, { ReactElement, useEffect, useReducer, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ConnectedVoters } from './ConnectedVoters'
import { fetchElectionStats } from '../../core/helpers/fetchElectionStats'
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

export type State = {
    stats: IBallotStats[]
    activeBallotIndex: 0
}

export type Action = { type: 'add'; payload: IBallotStats[] } | { type: 'update'; payload: IBallotStats }

export const statsReducer = (state: State, action: Action): State => {
    const newState = Object.assign({}, state)
    switch (action.type) {
        case 'add':
            newState.stats.push(...action.payload)
            break
        case 'update': {
            const currentStats = newState.stats.find((stat) => stat.ballotId == action.payload.ballotId)
            if (currentStats) {
                currentStats.stats = { ...action.payload.stats }
            } else {
                newState.stats.push(action.payload)
            }
            break
        }
    }
    return newState
}

export function ElectionInProgressView({ election }: { election: IElectionEntity }): ReactElement {
    const [socket] = useSocket()
    const [t] = useTranslation(['common', 'election'])
    const [modal, setModal] = useState(false)
    const [active, setActive] = useState(0)
    const [state, dispatch] = useReducer(statsReducer, { stats: [], activeBallotIndex: 0 })

    useEffect(() => {
        const storageService = new LocalStorageService<StorageKeys>()
        fetchElectionStats(election.id)
            .then((serverStats) => {
                dispatch({ type: 'add', payload: serverStats })
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
            dispatch({ type: 'update', payload: data })
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
        // todo fix this
        if (ballots[active + 1]) {
            setActive(active + 1)
        }
    }

    const hasPrevious = () => {
        // todo fix this
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
        return state.stats.find((stat) => stat.ballotId === ballotId)
    }

    return (
        <>
            <Row gutter={16}>
                <Col>
                    <Space direction="vertical">
                        <Title level={1}>{election.title}</Title>
                        <ElectionStatusCard election={election} />
                        <ConnectedVoters />
                    </Space>
                </Col>
                <Col span={12}>
                    <Title level={2}>{t('common:Ballots')}</Title>
                    {ballots.length > 0 ? (
                        <>
                            <BallotsQueue dataSource={ballots} stats={state.stats} expandBallot={showModal} />
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
