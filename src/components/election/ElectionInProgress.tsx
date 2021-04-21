import { Col, Row, Space } from 'antd'
import Title from 'antd/lib/typography/Title'
import { ElectionStatusCard } from 'components/election/ElectionStatusCard'
import BallotsQueue from 'components/queue/BallotsQueue'
import BallotModal from 'containers/modal/BallotModal'
import { Events } from 'core/events'
import { useSocket } from 'core/hooks/useSocket'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import { IBallotStats } from 'core/models/ballot/IBallotStats'
import { IElectionEntity } from 'core/models/election/IElectionEntity'
import { electionBallotReducer } from 'core/reducers/electionBallotsReducer'
import { LocalStorageService } from 'core/service/storage/LocalStorageService'
import { StorageKeys } from 'core/service/storage/StorageKeys'
import { WebsocketEvent } from 'core/socket/EventHandler'
import { AnoSocket } from 'core/state/websocket/IAnoSocket'
import React, { ReactElement, useEffect, useReducer, useState } from 'react'
import { useTranslation } from 'react-i18next'
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

export function ElectionInProgress({ election }: { election: IElectionEntity }): ReactElement {
    const [socket] = useSocket()
    const [t] = useTranslation(['common', 'election'])
    const [modal, setModal] = useState(false)
    const [ballotState, setBallotState] = useReducer(electionBallotReducer, {
        ballotWithStats: [],
        activeBallotIndex: 0,
    })
    useEffect(() => {
        const storageService = new LocalStorageService<StorageKeys>()
        fetchElectionStats(election.id)
            .then((serverStats) => {
                setBallotState({ type: 'addStats', payload: serverStats })
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
            setBallotState({ type: 'updateStats', payload: data })
        })

        setBallotState({ type: 'addBallots', payload: election.ballots as Array<IBallotEntity> })

        return () => {
            socket.disconnect()
        }
    }, [])

    /**
     * Display modal for a given ballot with id.
     * @param id the id to show modal for
     */
    const showModal = (id: number) => {
        setBallotState({ type: 'setActiveBallot', payload: id })
        setModal(true)
    }

    const closeModal = () => {
        setModal(false)
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
                    {ballotState.ballotWithStats.length > 0 ? (
                        <>
                            <BallotsQueue dataSource={ballotState.ballotWithStats} expandBallot={showModal} />
                            <BallotModal
                                showModal={modal}
                                ballot={ballotState.ballotWithStats[ballotState.activeBallotIndex]}
                                close={closeModal}
                                controls={{
                                    next: () => {
                                        setBallotState({ type: 'nextBallot' })
                                    },
                                    previous: () => {
                                        setBallotState({ type: 'previousBallot' })
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
