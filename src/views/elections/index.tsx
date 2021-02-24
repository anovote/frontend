import { Space } from 'antd'
import Title from 'antd/lib/typography/Title'
import { IElection } from 'core/models/IElection'
import { ElectionStatus } from 'core/models/IElectionStatus'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ElectionCard from '../../components/ElectionCard'

export default function ElectionsView(): React.ReactElement {
    const [t] = useTranslation(['common'])
    const [upcoming, setUpcoming] = useState([] as IElection[])
    const [inProgress, setInProgress] = useState([] as IElection[])
    const [finished, setFinished] = useState([] as IElection[])
    const data: IElection[] = [
        {
            id: 1,
            electionOrganizer: 1,
            description: 'This is a election description',
            title: 'My first election',
            isAutomatic: false,
            isLocked: true,
            status: ElectionStatus.NotStarted,
            openDate: new Date(2021, 3, 1, 10, 0),
            closeDate: new Date(2021, 5, 1, 10, 0),
            image: 'image.png',
        },
        {
            id: 2,
            electionOrganizer: 1,
            description: 'This is a election description',
            title: 'My first election',
            isAutomatic: false,
            isLocked: true,
            status: ElectionStatus.Finished,
            openDate: new Date(2021, 3, 1, 10, 0),
            closeDate: new Date(2021, 5, 1, 10, 0),
            image: 'image.png',
        },
        {
            id: 3,
            electionOrganizer: 1,
            description: 'This is a election description',
            title: 'My second election',
            isAutomatic: false,
            isLocked: true,
            status: ElectionStatus.Started,
            openDate: new Date(2021, 3, 1, 10, 0),
            closeDate: new Date(2021, 5, 1, 10, 0),
            image: 'image.png',
        },
        {
            id: 4,
            electionOrganizer: 1,
            description: 'This is a election description',
            title: 'My third election',
            isAutomatic: false,
            isLocked: true,
            status: ElectionStatus.NotStarted,
            openDate: new Date(2021, 3, 1, 10, 0),
            closeDate: new Date(2021, 5, 1, 10, 0),
            image: 'image.png',
        },
    ]
    useEffect(() => {
        const upcoming: IElection[] = []
        const started: IElection[] = []
        const finished: IElection[] = []
        for (const election of data) {
            if (election.status == ElectionStatus.NotStarted) upcoming.push(election)
            if (election.status == ElectionStatus.Started) started.push(election)
            if (election.status == ElectionStatus.Finished) finished.push(election)
        }

        setUpcoming(upcoming)
        setInProgress(started)
        setFinished(finished)
    }, [])

    return (
        <>
            <Title>{t('Elections')}</Title>
            <Space align="start" wrap={true}>
                <ElectionCard type={ElectionStatus.NotStarted} title={t('To be held')} data={upcoming}></ElectionCard>
                <ElectionCard type={ElectionStatus.Started} title={t('In progress')} data={inProgress}></ElectionCard>
                <ElectionCard type={ElectionStatus.Finished} title={t('Finished')} data={finished}></ElectionCard>
            </Space>
        </>
    )
}
