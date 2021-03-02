/* eslint-disable react/display-name */
import { BackendAPI } from 'core/api'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import BallotService from 'core/service/ballot/BallotService'
import * as React from 'react'
import { useCallback, useState } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import AddPreviewButton from './AddPreviewButton'
import { freshBallots } from 'dummy/ballotsDummyData'
import PreviewItem from './PreviewItem'

/**
 * Inspired by https://codesandbox.io/s/zqwz5n5p9x?file=/src/index.js
 * and https://egghead.io/lessons/react-persist-list-reordering-with-react-beautiful-dnd-using-the-ondragend-callback
 */

export default function PreviewList({ electionId }: { electionId?: number }): React.ReactElement {
    const [ballotsState, setBallotsState] = useState<IBallotEntity[]>(freshBallots)
    const addNewBallot = () => {
        // TODO
        console.log('Not implemented')
    }

    const reorder = (list: Array<IBallotEntity>, startIndex: number, endIndex: number) => {
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

    return (
        <div>
            <DragDropContext onDragEnd={onDragEndHandler}>
                <Droppable droppableId="ballots">
                    {(dropProvided) => (
                        <div ref={dropProvided.innerRef}>
                            {ballotsState.map(({ title, id }, index) => {
                                return <PreviewItem key={id} title={title} id={id.toString()} index={index} />
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

export function TestList(ballots: IBallotEntity[]): JSX.Element[] {
    return ballots.map((ballot: IBallotEntity, index: number) => {
        console.log(ballot)

        const { title, id } = ballot
        return <PreviewItem key={id} title={title} id={id.toString()} index={index} />
    })
}
