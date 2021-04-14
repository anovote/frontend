/* eslint-disable react/display-name */
import DraggableList from 'components/list/DraggableList'
import CreateBallotModal from 'containers/modal/CreateBallotModal'
import useChangedStateEffect from 'core/hooks/useChangedStateEffect'
import { IBallot, IBallotInList } from 'core/models/ballot/IBallot'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import { IElection } from 'core/models/election/IElection'
import * as React from 'react'
import { useCallback, useState } from 'react'
import { DropResult } from 'react-beautiful-dnd'
import AddPreviewButton from './AddPreviewButton'
import PreviewItem from './PreviewItem'

/**
 * The drag and drop is inspired by https://codesandbox.io/s/zqwz5n5p9x?file=/src/index.js
 * and https://egghead.io/lessons/react-persist-list-reordering-with-react-beautiful-dnd-using-the-ondragend-callback
 */

export default function PreviewList({
    initialElection,
    onChange,
}: {
    electionId?: number
    initialElection?: IElection
    onChange: (ballots: IBallotEntity[]) => void
}): React.ReactElement {
    const [ballotsState, setBallotsState] = useState<IBallotEntity[]>(
        initialElection && initialElection.ballots
            ? (initialElection.ballots as IBallotEntity[])
            : new Array<IBallotEntity>(),
    )
    const [createBallotModalState, setCreateBallotModalState] = useState<CreateBallotModalState>({
        show: false,
        initialBallot: undefined,
    })

    const onDragEndHandler = useCallback(
        (result: DropResult) => {
            const { destination, source } = result

            // Not dropped in drop context or not moved
            if (
                !destination ||
                (destination.index === source.index && destination.droppableId === source.droppableId)
            ) {
                return
            }

            const newBallots = reorder(ballotsState, source.index, destination.index) as IBallotEntity[]

            setBallotsState(setOrderOnBallots(newBallots))
        },
        [ballotsState],
    )

    useChangedStateEffect(() => {
        onChange(ballotsState)
    }, [ballotsState])

    const closeModalHandler = () => {
        setCreateBallotModalState({ show: false, initialBallot: undefined })
    }

    const addNewBallot = () => {
        setCreateBallotModalState({ show: true })
    }

    /**
     * Updates the ballot state
     * @param ballot The ballot returned from the createBallotModal
     */
    const onSubmitCreateBallotHandler = (ballot: IBallot, index?: number) => {
        const newState = Array.from(ballotsState)

        if (index !== undefined) {
            newState.splice(index, 1, ballot as IBallotEntity)
        } else {
            newState.push(ballot as IBallotEntity) // ! FIX something fishy with all this index use
        }
        const orderedBallots = setOrderOnBallots(newState)
        setBallotsState(orderedBallots)
        closeModalHandler()
    }

    /**
     * Setting the order on the ballot object
     */
    const setOrderOnBallots = (unOrderedBallots: IBallotEntity[]): IBallotEntity[] => {
        return unOrderedBallots.map((value, index) => {
            value.order = index
            return value
        })
    }

    const reorder = (list: Array<IBallot>, startIndex: number, endIndex: number) => {
        const result = Array.from(list)
        const [removed] = result.splice(startIndex, 1)
        result.splice(endIndex, 0, removed)

        return result
    }

    const onDeleteHandler = (index: number) => {
        const newState = Array.from(ballotsState)
        newState.splice(index, 1)
        setBallotsState(newState)
    }

    const onEditHandler = (id: number) => {
        const ballot: IBallotInList = { ...ballotsState[id], indexInList: id }

        setCreateBallotModalState({ show: true, initialBallot: ballot })
    }

    return (
        <div>
            {createBallotModalState.show && (
                <CreateBallotModal
                    initialBallot={createBallotModalState.initialBallot}
                    showModal={createBallotModalState.show}
                    close={closeModalHandler}
                    onSubmitted={onSubmitCreateBallotHandler}
                />
            )}
            <DraggableList list={ballotsState} onDragEndHandler={onDragEndHandler}>
                {(ballot: IBallotEntity, index: number) => (
                    <PreviewItem id={index} onDelete={() => onDeleteHandler(index)} onEdit={() => onEditHandler(index)}>
                        {ballot.title}
                    </PreviewItem>
                )}
            </DraggableList>
            <AddPreviewButton addPreview={addNewBallot} />
        </div>
    )
}

interface CreateBallotModalState {
    show: boolean
    initialBallot?: IBallotInList
}
