import { ExclamationCircleTwoTone } from '@ant-design/icons'
import { Modal, Popconfirm } from 'antd'
import Title from 'antd/lib/typography/Title'
import { ElectionStatusCard } from 'components/election/ElectionStatusCard'
import CloseElectionIcon from 'components/icons/CloseElectionIcon'
import BallotsQueue from 'components/queue/BallotsQueue'
import { ElectionParams } from 'components/queue/ElectionParams'
import IconButton from 'containers/button/IconButton'
import BallotModal from 'containers/modal/BallotModal'
import { ErrorCodeResolver } from 'core/error/ErrorCodeResolver'
import { Events } from 'core/events'
import useMessage, { Message } from 'core/hooks/useMessage'
import { useSocket } from 'core/hooks/useSocket'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import { IBallotStats } from 'core/models/ballot/IBallotStats'
import { IElectionEntity } from 'core/models/election/IElectionEntity'
import { electionBallotReducer, ElectionBallotStateAction } from 'core/reducers/electionBallotsReducer'
import { LocalStorageService } from 'core/service/storage/LocalStorageService'
import { StorageKeys } from 'core/service/storage/StorageKeys'
import { WebsocketEvent } from 'core/socket/EventHandler'
import { AnoSocket } from 'core/state/websocket/IAnoSocket'
import React, { ReactElement, useEffect, useReducer, useState } from 'react'
import { TFunction, useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { fetchElectionStats } from '../../core/helpers/fetchElectionStats'
import { ConnectedVoters } from './ConnectedVoters'
import ElectionSplitView from './ElectionSplitView'
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

/**
 *  Acknowledgement handler for pushed ballots.
 *
 * @param setBallotState state update method
 * @returns WebsocketEvent handler
 */
const pushBallotAck = (
    setBallotState: React.Dispatch<ElectionBallotStateAction>,
    dispatchErrorMessage: Message,
    t: TFunction<string[]>,
) => {
    return WebsocketEvent<{ ballot: IBallotEntity }>({
        dataHandler: (data) => {
            setBallotState({ type: 'updateBallot', payload: data.ballot })
        },
        errorHandler: (error) => {
            const errorCodeResolver = new ErrorCodeResolver(t)
            dispatchErrorMessage({ content: t('error:Unable to push ballot'), key: 'pushBallotAck' }).then(() => {
                dispatchErrorMessage({ content: errorCodeResolver.resolve(error.code), key: 'pushBallotAck' })
            })
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

    const { electionId } = useParams<ElectionParams>()
    const { error } = useMessage()

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

        socket.on(Events.server.ballot.update, (data: { ballot: IBallotEntity }) => {
            if (!data?.ballot) return
            setBallotState({ type: 'updateBallot', payload: data.ballot })
        })

        setBallotState({ type: 'addBallots', payload: election.ballots as Array<IBallotEntity> })

        return () => {
            socket.disconnect()
        }
    }, [])

    async function doPushBallot(id: number) {
        const ballot = ballotState.ballotWithStats.find((ballot) => ballot.id === id)
        if (ballot && electionId) {
            socket.emit(
                Events.client.ballot.push,
                { ballotId: ballot.id, electionId: Number.parseInt(electionId) },
                pushBallotAck(setBallotState, error, t),
            )
        }
    }

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
                    error({ content: t('error:Something happened when trying to end the election') })
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
                    error({ content: t('error:Something happened when trying to force end the election') })
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
            <ElectionSplitView
                election={election}
                left={
                    <>
                        <Popconfirm
                            placement="bottom"
                            title={t('form:Are you sure')}
                            onConfirm={() => endElectionOnConfirm(election.id)}
                            okButtonProps={{ className: 'btn-danger' }}
                            icon={<ExclamationCircleTwoTone twoToneColor={'#FF5A90'} />}
                            okText={t('common:Yes')}
                            cancelText={t('common:No')}
                        >
                            <IconButton
                                icon={<CloseElectionIcon />}
                                text={`${t('common:End')} ${t('election:Election')}`}
                                color="danger"
                            />
                        </Popconfirm>
                        <ElectionStatusCard election={election} />
                        <ConnectedVoters />
                    </>
                }
                right={
                    <>
                        <Title level={2}>{t('common:Ballots')}</Title>
                        {ballotState.ballotWithStats.length > 0 ? (
                            <>
                                <BallotsQueue
                                    dataSource={ballotState.ballotWithStats}
                                    expandBallot={showModal}
                                    doPushBallot={doPushBallot}
                                />
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
                    </>
                }
            />
        </>
    )
}
