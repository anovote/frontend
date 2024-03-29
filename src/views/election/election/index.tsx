import { Skeleton } from 'antd'
import { ElectionFinished } from 'components/election/ElectionFinished'
import { ElectionInProgress } from 'components/election/ElectionInProgress'
import { ElectionNotStarted } from 'components/election/ElectionNotStarted'
import { ElectionParams } from 'components/queue/ElectionParams'
import { BackendAPI } from 'core/api'
import { AlertState } from 'core/hooks/useAlert'
import useMessage from 'core/hooks/useMessage'
import { ElectionStatus } from 'core/models/election/ElectionStatus'
import { IElectionEntity } from 'core/models/election/IElectionEntity'
import { getAdminRoute } from 'core/routes/siteRoutes'
import { ElectionService } from 'core/service/election/ElectionService'
import { StatusCodes } from 'http-status-codes'
import * as React from 'react'
import { useEffect, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useParams } from 'react-router-dom'
import ElectionForm from '../electionForm/ElectionForm'

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
    const { success, loading, warning, error } = useMessage()

    const { electionId } = useParams<ElectionParams>()
    const electionService = new ElectionService(BackendAPI)

    useEffect(() => {
        if (!electionId) {
            history.push(getAdminRoute().elections.view)
            return
        }
        if (Number.isNaN(Number.parseInt(electionId))) {
            warning({ content: t('error:Election ID is not a number') })
            history.push(getAdminRoute().elections.view)
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
            success({ content: t('common:Value updated', { value: 'Election' }) })
            dispatch({ type: 'updateSuccess', election: updatedElection })
        } catch (err) {
            console.log(err)
            dispatch({ type: 'error', message: err.message })
        }
    }

    const fetchElection = async (electionId: string) => {
        try {
            dispatch({ type: 'fetchingElection' })
            const response = await electionService.getElection(Number.parseInt(electionId))
            dispatch({ type: 'gotElection', election: response })
        } catch (reason) {
            if (reason.response.status === StatusCodes.NOT_FOUND) {
                loading({ content: t('election:Fetching election'), duration: 1, key: 'fetching' }).then(() => {
                    history.push(getAdminRoute().elections.view)
                    warning({ content: t('common:Value not found', { value: 'Election' }), key: 'fetching' })
                })
                return
            }
            dispatch({ type: 'error', message: reason })
        }
    }

    const onElectionChangeHandler = async (election: IElectionEntity, toDelete?: boolean) => {
        if (toDelete) {
            dispatch({ type: 'deleteElection', election })
            try {
                await electionService.delete(election)
                dispatch({ type: 'deleteSuccess' })
                success({ content: t('election:Delete was successful') })
                history.push(getAdminRoute().elections.view)
            } catch ({ message }) {
                dispatch({ type: 'error', message })
                error({ content: t('common:Action failed', { action: 'Delete' }) })
            }
        } else {
            dispatch({ type: 'updateElectionStatus', election })
            updateElection(election)
        }
    }

    const handleDelete = (election: IElectionEntity) => onElectionChangeHandler(election, true)

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
            return <ElectionForm initialElection={election} onUpdate={onUpdateHandler} onAbort={handleAbort} />
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
                return <ElectionInProgress election={election} />
            case ElectionStatus.Finished:
                return <ElectionFinished election={election} onDeleteElection={handleDelete} />
            default:
                error({ content: t('error:Something went wrong') })
                history.push(getAdminRoute().elections.view)

                return null
        }
    }

    return (
        <>
            {isLoading && (
                <>
                    <Skeleton active />
                    <Skeleton active />
                    <Skeleton active />
                </>
            )}

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
        case 'deleteSuccess':
            return { ...state, isLoading: false, election: undefined }
        case 'abortEdit':
            return { ...state, edit: false }
        case 'edit': {
            return { ...state, edit: true }
        }
        case 'deleteElection':
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
