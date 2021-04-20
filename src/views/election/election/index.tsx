import { Spin } from 'antd'
import { ElectionFinished } from 'components/election/ElectionFinished'
import { ElectionInProgressView } from 'components/election/ElectionInProgress'
import { ElectionNotStarted } from 'components/election/ElectionNotStarted'
import { ElectionParams } from 'components/queue/ElectionParams'
import { BackendAPI } from 'core/api'
import { ElectionStatus } from 'core/models/election/ElectionStatus'
import { IElectionEntity } from 'core/models/election/IElectionEntity'
import { ElectionService } from 'core/service/election/ElectionService'
import * as React from 'react'
import { useEffect, useReducer } from 'react'
import { useParams } from 'react-router-dom'
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

    const { electionId } = useParams<ElectionParams>()
    const electionService = new ElectionService(BackendAPI)

    useEffect(() => {
        if (!electionId) {
            // todo
            throw new Error('missing ID')
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
                .then((response) => {
                    dispatch({ type: 'gotElection', election: response })
                })
                .catch((reason) => {
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

    const renderElectionView = (election: IElectionEntity) => {
        if (edit) {
            return <CreateElectionView initialElection={election} onUpdate={onUpdateHandler} />
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
        case 'edit': {
            return { ...state, edit: true }
        }
        case 'fetchingElection':
            return { ...state, isLoading: true }
        case 'gotElection':
            return { ...state, isLoading: false, election: action.election }
        case 'error':
            console.error(action.message)
            // todo #131 redirect if election with id does not exist
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
    | { type: 'fetchingElection' | 'success' | 'edit' | 'deleteSuccess' }
    | {
          type: 'gotElection' | 'updateElectionStatus' | 'updateElection' | 'updateSuccess' | 'deleteElection'
          election: IElectionEntity
      }
    | { type: 'error'; message: string }
