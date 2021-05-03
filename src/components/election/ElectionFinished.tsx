import { DeleteOutlined, DeleteTwoTone, OrderedListOutlined } from '@ant-design/icons'
import { List, Popconfirm, PopconfirmProps, Space } from 'antd'
import Title from 'antd/lib/typography/Title'
import { ElectionStatusCard } from 'components/election/ElectionStatusCard'
import BallotsQueue from 'components/queue/BallotsQueue'
import IconButton from 'containers/button/IconButton'
import BallotModal from 'containers/modal/BallotModal'
import { fetchElectionStats } from 'core/helpers/fetchElectionStats'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import { IElectionEntity } from 'core/models/election/IElectionEntity'
import { electionBallotReducer } from 'core/reducers/electionBallotsReducer'
import React, { ReactElement, useEffect, useReducer, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router'
import ElectionSplitView from './ElectionSplitView'

export const ElectionFinished = ({
    election,
    onDeleteElection,
}: {
    election: IElectionEntity
    onDeleteElection: (election: IElectionEntity) => void
}): ReactElement => {
    const [t] = useTranslation(['common', 'election'])
    const history = useHistory()
    const location = useLocation()
    const [showBallotModal, setShowBallotModal] = useState(false)
    const [ballotState, setBallotState] = useReducer(electionBallotReducer, {
        ballotWithStats: [],
        activeBallotIndex: 0,
    })
    useEffect(() => {
        fetchElectionStats(election.id)
            .then((serverStats) => {
                setBallotState({ type: 'addStats', payload: serverStats })
            })
            .catch((err) => {
                console.log(err)
            })

        const ballots = election.ballots
            ? election.ballots.map((ballot) => ({ ...ballot } as IBallotEntity))
            : new Array<IBallotEntity>()
        setBallotState({ type: 'addBallots', payload: ballots })
    }, [])

    /**
     * Display modal for a given ballot with id.
     * @param id the id to show modal for
     */
    const doShowBallotModal = (id: number) => {
        setBallotState({ type: 'setActiveBallot', payload: id })
        setShowBallotModal(true)
    }

    const closeModal = () => {
        setShowBallotModal(false)
    }

    const gotoResultsPage = () => {
        history.push(location.pathname + '/results')
    }

    const popConfirmProps: PopconfirmProps = {
        title: t('form:Are you sure'),
        okText: t('form:Delete'),
        cancelText: t('form:Cancel'),
        okButtonProps: { className: 'btn-danger' },
        icon: <DeleteTwoTone twoToneColor={'#FF5A90'} />,
        onConfirm: () => onDeleteElection(election),
    }

    return (
        <>
            <ElectionSplitView
                election={election}
                left={
                    <>
                        <ElectionStatusCard {...{ election }} />
                        <div>{election.description}</div>
                        <Space>
                            <Popconfirm {...popConfirmProps}>
                                <IconButton icon={<DeleteOutlined />} text="Delete" color="danger" />
                            </Popconfirm>
                            <IconButton
                                icon={<OrderedListOutlined />}
                                text="Results"
                                onClick={gotoResultsPage}
                                color="success"
                            />
                        </Space>
                        <ElectionStatusCard {...{ election }} />
                        <Title level={2}>{t('common:Eligible voters')}</Title>
                        <List
                            id="voters-list"
                            dataSource={election.eligibleVoters}
                            renderItem={(item) => <List.Item>{item.identification}</List.Item>}
                        />
                    </>
                }
                right={
                    <>
                        <Title level={2}>{t('common:Ballots')}</Title>
                        {ballotState.ballotWithStats.length > 0 ? (
                            <>
                                <BallotsQueue
                                    dataSource={ballotState.ballotWithStats}
                                    expandBallot={doShowBallotModal}
                                />
                                <BallotModal
                                    showModal={showBallotModal}
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
