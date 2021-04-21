import { Spin } from 'antd'
import { ElectionFinished } from 'components/election/ElectionFinished'
import { ElectionInProgressView } from 'components/election/ElectionInProgress'
import { ElectionNotStarted } from 'components/election/ElectionNotStarted'
import { ElectionParams } from 'components/queue/ElectionParams'
import { BackendAPI } from 'core/api'
import { AlertState } from 'core/hooks/useAlert'
import { ElectionStatus } from 'core/models/election/ElectionStatus'
import { IElectionEntity } from 'core/models/election/IElectionEntity'
import { getAdminRoute } from 'core/routes/siteRoutes'
import { ElectionService } from 'core/service/election/ElectionService'
import { StatusCodes } from 'http-status-codes'
import * as React from 'react'
import { useEffect, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useParams } from 'react-router-dom'
import CreateElectionView from '../createElection'

/**
 * The main view used for creating an election
 */
export default function ElectionView(): React.ReactElement {
    const initialState: ElectionViewState = {
        isLoading: false,
        election: undefined,
        edit: false,
    }
    const [{ isLoading, election, edit }, dispatch] = useReducer(reducer, initialState)
    const history = useHistory<AlertState>()
    const [t] = useTranslation(['error', 'election'])

    const { electionId } = useParams<ElectionParams>()
    const electionService = new ElectionService(BackendAPI)

    useEffect(() => {
        if (!electionId) {
            history.push(getAdminRoute().elections.view, { message: t('error:Election not found'), level: 'error' })
            return
        }
        if (Number.isNaN(Number.parseInt(electionId))) {
            history.push(getAdminRoute().elections.view, {
                message: t('error:Election ID is not a number'),
                level: 'error',
            })
            return
        }
        fetchElection(electionId)
    }, [])

    const updateElection = async (election: IElectionEntity) => {
        if (!electionId) {
            throw new Error('No election ID')
        }
        election.id = Number.parseInt(electionId)
        try {
            const updatedElection = await electionService.updateElection(election)
            dispatch({ type: 'updateSuccess', election: updatedElection })
        } catch (err) {
            console.log(err)
            dispatch({ type: 'error', message: err.message })
        }
    }

    const fetchElection = (electionId: string) => {
        dispatch({ type: 'fetchingElection' })
        setTimeout(() => {
            // todo remove timeout. only here to demonstrate loading
            electionService
                .getElection(Number.parseInt(electionId))
                .then((election) => {
                    dispatch({ type: 'gotElection', election })
                })
                .catch((reason) => {
                    if (reason.response.status === StatusCodes.NOT_FOUND) {
                        const { message }: { message: string } = reason.response.data
                        history.push(getAdminRoute().elections.view, { message, level: 'error' })
                        return
                    }
                    dispatch({ type: 'error', message: reason })
                })
        }, 1000)
    }

    const onElectionChangeHandler = async (election: IElectionEntity, toDelete?: boolean) => {
        if (toDelete) {
            dispatch({ type: 'deleteElection', election })
            try {
                await electionService.delete(election)
                dispatch({ type: 'deleteSuccess' })
                const message = t('election:Delete was successful')
                history.push(getAdminRoute().elections.view, {
                    message,
                    level: 'info',
                })
            } catch ({ message }) {
                dispatch({ type: 'error', message })
            }
        } else {
            dispatch({ type: 'updateElectionStatus', election })
            updateElection(election)
        }
    }

    const onUpdateHandler = (election: IElectionEntity) => {
        election.status = ElectionStatus.NotStarted
        dispatch({ type: 'updateElection', election })
        updateElection(election)
    }

    const handleAbort = () => {
        dispatch({ type: 'abortEdit' })
    }

    const renderElectionView = (election: IElectionEntity) => {
        if (edit) {
            return <CreateElectionView initialElection={election} onUpdate={onUpdateHandler} onAbort={handleAbort} />
        }
        switch (election.status) {
            case ElectionStatus.NotStarted:
                return (
                    <ElectionNotStarted
                        election={election}
                        onElectionChange={(election, toDelete) => onElectionChangeHandler(election, toDelete)}
                        onElectionEdit={() => dispatch({ type: 'edit' })}
                    />
                )
            case ElectionStatus.Started:
                return <ElectionInProgressView election={election} />
            case ElectionStatus.Finished:
                // todo create view when results are finished
                return <ElectionFinished />
            default:
                console.error('status not set')
                history.push(getAdminRoute().elections.view, {
                    message: t('error:Something went wrong'),
                    level: 'error',
                })
                return null
        }
    }

    return (
        <>
            {isLoading && <Spin />}
            {!isLoading && election && renderElectionView(election)}
        </>
    )
}

type ElectionViewState = {
    isLoading: boolean
    election?: IElectionEntity
    edit: boolean
}

function reducer(state: ElectionViewState, action: ElectionViewActions): ElectionViewState {
    switch (action.type) {
        case 'deleteElection': {
            return { ...state, isLoading: true }
        }
        case 'deleteSuccess':
            return { ...state, isLoading: false, election: undefined }
        case 'abortEdit':
            return { ...state, edit: false }
        case 'edit': {
            return { ...state, edit: true }
        }
        case 'fetchingElection':
            return { ...state, isLoading: true }
        case 'gotElection':
            return { ...state, isLoading: false, election: action.election }
        case 'error':
            console.error(action.message)
            return { ...state, isLoading: false, edit: false }
        case 'updateElectionStatus':
        case 'updateElection':
            return { ...state, election: action.election, isLoading: true }
        case 'updateSuccess':
            return { ...state, election: action.election, isLoading: false, edit: false }
        default:
            return state
    }
}

type ElectionViewActions =
    | { type: 'fetchingElection' | 'success' | 'edit' | 'deleteSuccess' | 'abortEdit' }
    | {
          type: 'gotElection' | 'updateElectionStatus' | 'updateElection' | 'updateSuccess' | 'deleteElection'
          election: IElectionEntity
      }
    | { type: 'error'; message: string }
