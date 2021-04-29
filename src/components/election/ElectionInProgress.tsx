import { Col, Divider, Modal, Popconfirm, Row, Space } from 'antd'
import Title from 'antd/lib/typography/Title'
import { AlertList } from 'components/alert/AlertList'
import { ElectionStatusCard } from 'components/election/ElectionStatusCard'
import ElectionStatusLabel from 'components/ElectionStatusLabel'
import CloseElectionIcon from 'components/icons/CloseElectionIcon'
import BallotsQueue from 'components/queue/BallotsQueue'
import IconButton from 'containers/button/IconButton'
import BallotModal from 'containers/modal/BallotModal'
import { Events } from 'core/events'
import { useAlert } from 'core/hooks/useAlert'
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
    const [forceEndVisible, setForceEndVisible] = useState(false)
    const { alertStates: alerts, dispatchAlert: setAlerts } = useAlert([{ message: '', level: undefined }])

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

    const endElectionOnConfirm = async (id: number) => {
        socket.emit(
            Events.client.election.close,
            { electionId: id },
            WebsocketEvent({
                dataHandler: (data: { finished: boolean; needForceEnd: boolean; closeDate: Date }) => {
                    if (data.needForceEnd) {
                        setForceEndVisible(true)
                    }
                    if (data.finished) onFinishedElection()
                },
                errorHandler: () => {
                    setAlerts({
                        type: 'add',
                        level: 'error',
                        message: 'Something happened when trying to end election',
                    })
                },
            }),
        )
    }

    const forceEndElection = async (id: number) => {
        socket.emit(
            Events.client.election.close,
            { id, forceEnd: true },
            WebsocketEvent({
                dataHandler: (data: { finished: boolean; needForceEnd: boolean; election: IElectionEntity }) => {
                    if (data.finished) onFinishedElection()
                },
                errorHandler: () => {
                    setAlerts({
                        type: 'add',
                        level: 'error',
                        message: 'Something happened when trying to force end election',
                    })
                },
            }),
        )
    }

    const onFinishedElection = () => {
        setForceEndVisible(false)
        window.location.reload()
    }

    return (
        <>
            {/** Modal for force end election */}
            <Modal
                title={t('election:Confirm close of election')}
                visible={forceEndVisible}
                onOk={() => forceEndElection(election.id)}
                onCancel={() => setForceEndVisible(false)}
            >
                <p>{t('election:This election have a closing date')}</p>
                <p>{t('election:If you proceed to end this election')}</p>
                <p>{t('election:Are you sure you want to')}?</p>
            </Modal>
            <AlertList alerts={alerts} />
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
                    <Popconfirm
                        placement="bottom"
                        title={`${t('form:Are you sure')}?`}
                        onConfirm={() => endElectionOnConfirm(election.id)}
                        okText={t('common:Yes')}
                        cancelText={t('common:No')}
                    >
                        <IconButton
                            icon={<CloseElectionIcon />}
                            text={`${t('common:End')} ${t('election:Election')}`}
                            color="red"
                        />
                    </Popconfirm>
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
