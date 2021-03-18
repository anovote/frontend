import { Card, Col, Row, Space } from 'antd'
import Title from 'antd/lib/typography/Title'
import { ElectionParams } from 'components/queue/ElectionParams'
import { BackendAPI } from 'core/api'
import { ElectionStatus } from 'core/models/ElectionStatus'
import { IElection } from 'core/models/IElection'
import { ElectionService } from 'core/service/election/ElectionService'
import * as React from 'react'
import { useEffect, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { elections } from '../../../dummy/electionsDummyData'
import CreateElectionView from '../createElection'
import { ElectionInProgressView } from '../ElectionInProgressView'
import { ElectionStatusCard } from './ElectionStatusCard'

/**
 * The main view used for creating an election
 */
export default function ElectionView(): React.ReactElement {
    const initialState: ElectionViewState = {
        isLoading: false,
        election: undefined,
    }
    const [{ isLoading, election }, dispatch] = useReducer(reducer, initialState)

    const [t] = useTranslation(['translation', 'common', 'election'])
    const { electionId } = useParams<ElectionParams>()

    // fetch data
    useEffect(() => {
        if (!electionId) {
            // todo
            throw new Error('missing ID')
        }
        fetchElection(electionId)
    }, [])

    const fetchElection = (electionId: string) => {
        dispatch({ type: 'fetchingElection' })
        new ElectionService(BackendAPI)
            .getElection(Number.parseInt(electionId))
            .then((response) => {
                console.log(response)
                dispatch({ type: 'gotElection', election: response })
            })
            .catch((reason) => {
                dispatch({ type: 'error', message: reason })
            })
    }

    const renderElectionView = (election: IElection) => {
        switch (election.status) {
            case ElectionStatus.NotStarted:
                return <CreateElectionView initialElection={election} />
            case ElectionStatus.Started:
                return <ElectionInProgressView election={election} />
            case ElectionStatus.Finished:
                // todo create view when results are finished
                return 'Election finished'
            default:
                return null
        }
    }

    const cardTitle = <Title level={2}>{t('election:Connected voters')}</Title>
    return (
        <>
            {!isLoading && election && (
                <Row>
                    <Col>
                        <Space direction={'vertical'}>
                            {election.status === ElectionStatus.Started ? (
                                <>
                                    <ElectionStatusCard election={elections[0]} />
                                    <Card className={'info-card'} title={cardTitle}>
                                        <div className="is-flex-column has-content-center-center">
                                            <span className={'text-large'}>1337</span> {/* todo fetch real time*/}
                                        </div>
                                    </Card>
                                </>
                            ) : null}
                        </Space>
                    </Col>
                    <Col span={16}>{renderElectionView(election)}</Col>
                </Row>
            )}
        </>
    )
}

type ElectionViewState = {
    isLoading: boolean
    election?: IElection
}
function reducer(state: ElectionViewState, action: ElectionViewActions): ElectionViewState {
    switch (action.type) {
        case 'fetchingElection':
            return { ...state, isLoading: true }
        case 'gotElection':
            return { ...state, isLoading: false, election: action.election }
        case 'error':
            console.error(action.message)
            // todo redirect if election with id does not exist
            return { ...state, isLoading: false }
        default:
            return state
    }
}

type ElectionViewActions =
    | { type: 'fetchingElection' }
    | { type: 'gotElection'; election: IElection }
    | { type: 'error'; message: string }
