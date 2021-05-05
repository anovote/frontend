import { DeleteOutlined, DeleteTwoTone, EditOutlined, ForwardFilled } from '@ant-design/icons'
import { List, Popconfirm, PopconfirmProps, Space } from 'antd'
import Title from 'antd/lib/typography/Title'
import { ElectionStatusCard } from 'components/election/ElectionStatusCard'
import BallotPreviewList from 'components/previewList/BallotPreviewList'
import IconButton from 'containers/button/IconButton'
import { IBallot } from 'core/models/ballot/IBallot'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import { ElectionStatus } from 'core/models/election/ElectionStatus'
import { IElectionEntity } from 'core/models/election/IElectionEntity'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import ElectionSplitView from './ElectionSplitView'

export const ElectionNotStarted = ({
    election,
    onElectionChange,
    onElectionEdit,
}: ElectionNotStartedProps): ReactElement => {
    const [t] = useTranslation(['common', 'election', 'form'])
    const deleteElectionHandler = () => {
        onElectionChange(election, true)
    }

    let timerId: NodeJS.Timeout | undefined = undefined

    const changeElectionToStarted = () => {
        const newElection: IElectionEntity = { ...election, status: ElectionStatus.Started }
        onElectionChange(newElection)
    }

    const editElection = () => {
        onElectionEdit()
    }

    const onChangeHandler = (ballots: IBallot[]) => {
        const newElection: IElectionEntity = { ...election, ballots }
        if (timerId) {
            console.log('clear timeout')
            clearTimeout(timerId)
        }
        timerId = setTimeout(async () => {
            console.log('update on server')
            timerId = undefined
            onElectionChange(newElection)
        }, 3000)
    }

    const ballots = election.ballots
        ? election.ballots.map((ballot, index) => ({ id: index, ...ballot } as IBallotEntity))
        : new Array<IBallotEntity>()

    const popConfirmProps: PopconfirmProps = {
        placement: 'bottom',
        title: t('form:Are you sure'),
        okText: t('form:Delete'),
        cancelText: t('form:Cancel'),
        okButtonProps: { className: 'btn-danger' },
        icon: <DeleteTwoTone twoToneColor={'#FF5A90'} />,
        onConfirm: () => deleteElectionHandler(),
    }

    return (
        <>
            <ElectionSplitView
                election={election}
                left={
                    <>
                        <div>{election.description}</div>
                        <div className="mb-10">
                            <Space wrap={true} direction={'horizontal'}>
                                <IconButton
                                    icon={<ForwardFilled />}
                                    text="Begin"
                                    onClick={changeElectionToStarted}
                                    color="success"
                                />
                                <Popconfirm {...popConfirmProps}>
                                    <IconButton icon={<DeleteOutlined />} text={t('form:Delete')} color="danger" />
                                </Popconfirm>
                                <IconButton icon={<EditOutlined />} text="Edit election" onClick={editElection} />
                            </Space>
                        </div>
                        <ElectionStatusCard {...{ election }} />
                        <Title level={2}>{t('common:Eligible voters')}</Title>
                        <List
                            id="voters-list"
                            locale={{ emptyText: t('election:No eligible voters') }}
                            dataSource={election.eligibleVoters}
                            renderItem={(item) => <List.Item>{item.identification}</List.Item>}
                        />
                    </>
                }
                right={
                    <>
                        <Title level={2}>{t('common:Ballots')}</Title>
                        {ballots.length > 0 ? (
                            <BallotPreviewList initialElection={election} onChange={onChangeHandler} />
                        ) : (
                            <span>{t('common:no-ballots')}</span>
                        )}
                    </>
                }
            />
        </>
    )
}

interface ElectionNotStartedProps {
    election: IElectionEntity
    onElectionChange: (election: IElectionEntity, toDelete?: boolean) => void
    onElectionEdit: () => void
}
