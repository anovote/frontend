/* eslint-disable react/display-name */
import { BackendAPI } from 'core/api'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import BallotService from 'core/service/ballot/BallotService'
import * as React from 'react'
import { useCallback, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import AddPreviewButton from './AddPreviewButton'
import { freshBallots } from 'dummy/ballotsDummyData'
import PreviewItem from './PreviewItem'
import CreateBallotModal from 'containers/modal/CreateBallotModal'
import { IBallot } from 'core/models/ballot/IBallot'

/**
 * Inspired by https://codesandbox.io/s/zqwz5n5p9x?file=/src/index.js
 * and https://egghead.io/lessons/react-persist-list-reordering-with-react-beautiful-dnd-using-the-ondragend-callback
 */

export default function PreviewList({ electionId }: { electionId?: number }): React.ReactElement {
    const [ballotsState, setBallotsState] = useState<IBallot[]>(freshBallots)
    const [createBallotModalState, setCreateBallotModalState] = useState<CreateBallotModalState>({
        show: false,
        initialBallot: undefined,
    })

    const closeModalHandler = () => {
        setCreateBallotModalState({ show: false, initialBallot: undefined })
    }

    const addNewBallot = () => {
        // TODO
        console.log('Add new ballot')
        setCreateBallotModalState({ show: true })
    }

    const onSubmitCreateBallotHandler = (ballot: IBallot) => {
        ballotsState.push(ballot)
        setBallotsState(ballotsState)
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
            console.log('updating ballots state')
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

    const onDeleteHandler = () => {
        console.log('item delete click')
    }
    const onEditHandler = (id: number) => {
        const ballot = ballotsState[id]
        setCreateBallotModalState({ show: true, initialBallot: ballot })
    }

    return (
        <div>
            {console.log(ballotsState)}
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
                                                    onDelete={onDeleteHandler}
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
    initialBallot?: IBallot
}
