import { Space } from 'antd'
import Item from 'antd/lib/list/Item'
import Title from 'antd/lib/typography/Title'
import { AlertList } from 'components/alert/AlertList'
import CardList from 'components/cards/CardList'
import ElectionEntry from 'components/list/entries/electionEntry'
import ElectionHeader from 'components/list/headers/electionHeader'
import { BackendAPI } from 'core/api'
import { AnovoteAlertState, useAlert } from 'core/hooks/useAlert'
import { ElectionStatus } from 'core/models/election/ElectionStatus'
import { IElectionEntity } from 'core/models/election/IElectionEntity'
import { ElectionService } from 'core/service/election/ElectionService'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'

export default function ElectionsView(): React.ReactElement {
    const [t] = useTranslation(['common', 'election'])
    const [upcoming, setUpcoming] = useState([] as IElectionEntity[])
    const [inProgress, setInProgress] = useState([] as IElectionEntity[])
    const [finished, setFinished] = useState([] as IElectionEntity[])
    const location = useLocation<AnovoteAlertState>()
    const history = useHistory<AnovoteAlertState>()

    const [alertState, alertDispatch] = useAlert([{ message: '', alertType: undefined }])

    useEffect(() => {
        new ElectionService(BackendAPI)
            .getAllElection()
            .then((response) => {
                const upcoming: IElectionEntity[] = []
                const started: IElectionEntity[] = []
                const finished: IElectionEntity[] = []

                for (const election of response) {
                    if (election.status == ElectionStatus.NotStarted) upcoming.push(election)
                    if (election.status == ElectionStatus.Started) started.push(election)
                    if (election.status == ElectionStatus.Finished) finished.push(election)
                }

                setUpcoming(upcoming)
                setInProgress(started)
                setFinished(finished)

                if (location.state) {
                    alertDispatch({
                        type: 'add',
                        alertType: location.state.alertType,
                        message: location.state.message,
                        description: location.state.description,
                    })
                    resetHistoryState()
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    /**
     * Resets the history state
     * The history location should stay intact
     */
    const resetHistoryState = () => {
        const state: AnovoteAlertState = { message: '', alertType: undefined }
        history.replace({ ...history.location, state })
    }

    /**
     * Generates the list entry with correct elements.
     * @param item the election object to render in list
     */
    const render = (item: IElectionEntity) => {
        return (
            <Item>
                <ElectionEntry election={item} />
            </Item>
        )
    }

    return (
        <>
            <AlertList alertProps={alertState} />
            <Title>{t('common:Elections')}</Title>
            <Space align="start" wrap={true}>
                <CardList
                    listHeader={
                        <ElectionHeader
                            status={ElectionStatus.NotStarted}
                            title={t('election:To be held')}
                            count={upcoming.length}
                        />
                    }
                    list={upcoming}
                    renderItem={(item) => render(item)}
                    classNames="election-card"
                ></CardList>
                <CardList
                    listHeader={
                        <ElectionHeader
                            status={ElectionStatus.Started}
                            title={t('election:In progress')}
                            count={inProgress.length}
                        />
                    }
                    renderItem={(item) => render(item)}
                    list={inProgress}
                    classNames="election-card"
                ></CardList>
                <CardList
                    listHeader={
                        <ElectionHeader
                            status={ElectionStatus.Finished}
                            title={t('election:Finished')}
                            count={finished.length}
                        />
                    }
                    list={finished}
                    renderItem={(item) => render(item)}
                    classNames="election-card"
                ></CardList>
            </Space>
        </>
    )
}
