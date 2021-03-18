/* eslint-disable react/display-name */
import CreateBallotModal from 'containers/modal/CreateBallotModal'
import { BackendAPI } from 'core/api'
import { IBallot, IBallotInList } from 'core/models/ballot/IBallot'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import BallotService from 'core/service/ballot/BallotService'
import { IElectionDetails } from 'core/service/election/IElectionDetails'
import * as React from 'react'
import { useCallback, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import AddPreviewButton from './AddPreviewButton'
import PreviewItem from './PreviewItem'

/**
 * The drag and drop is inspired by https://codesandbox.io/s/zqwz5n5p9x?file=/src/index.js
 * and https://egghead.io/lessons/react-persist-list-reordering-with-react-beautiful-dnd-using-the-ondragend-callback
 */

export default function PreviewList({
    electionId,
    initialElection,
}: {
    electionId?: number
    initialElection?: IElectionDetails
}): React.ReactElement {
    const [ballotsState, setBallotsState] = useState<IBallot[]>(
        initialElection && initialElection.ballots ? initialElection.ballots : new Array<IBallot>(),
    )
    const [createBallotModalState, setCreateBallotModalState] = useState<CreateBallotModalState>({
        show: false,
        initialBallot: undefined,
    })

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
            newState.splice(index, 1, ballot)
        } else {
            newState.push(ballot)
        }
        setBallotsState(newState)
        closeModalHandler()
    }

    const reorder = (list: Array<IBallot>, startIndex: number, endIndex: number) => {
        const result = Array.from(list)
        const [removed] = result.splice(startIndex, 1)
        result.splice(endIndex, 0, removed)

        return result
    }

    const updateOnServer = async (electionId: number) => {
        new BallotService(BackendAPI).updateBallots(electionId, ballotsState)
    }

    const onDragEndHandler = useCallback(
        (result) => {
            const { destination, source } = result

            // Not dropped in drop context or not moved
            if (
                !destination ||
                (destination.index === source.index && destination.droppableId === source.droppableId)
            ) {
                return
            }

            const newBallots = reorder(ballotsState, source.index, destination.index) as IBallotEntity[]
            setBallotsState(newBallots)

            // only update on server if election exists
            if (electionId) {
                updateOnServer(electionId)
            }
        },
        [ballotsState],
    )

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
            <DragDropContext onDragEnd={onDragEndHandler}>
                <Droppable droppableId="ballots">
                    {(dropProvided) => (
                        <div ref={dropProvided.innerRef}>
                            {ballotsState.map(({ title }, index) => {
                                return (
                                    <Draggable key={index} draggableId={index.toString()} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <PreviewItem
                                                    key={index}
                                                    itemTitle={title}
                                                    id={index.toString()}
                                                    onDelete={() => onDeleteHandler(index)}
                                                    onEdit={() => onEditHandler(index)}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                )
                            })}
                            {dropProvided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <AddPreviewButton addPreview={addNewBallot} />
        </div>
    )
}

interface CreateBallotModalState {
    show: boolean
    initialBallot?: IBallotInList
}
