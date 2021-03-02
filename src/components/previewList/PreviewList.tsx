/* eslint-disable react/display-name */
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import * as React from 'react'
import { useEffect } from 'react'
import { useCallback, useState } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import AddPreviewButton from './AddPreviewButton'
import { freshBallots } from './dummyData'
import PreviewItem from './PreviewItem'

/**
 * Inspired by https://codesandbox.io/s/zqwz5n5p9x?file=/src/index.js
 * and https://egghead.io/lessons/react-persist-list-reordering-with-react-beautiful-dnd-using-the-ondragend-callback
 */

export default function PreviewList(): React.ReactElement {
    const [ballotsState, setBallotsState] = useState<IBallotEntity[]>(freshBallots)
    const addNewBallot = () => {
        // TODO
        console.log('Not implemented')
    }

    const reorder = (list: Array<any>, startIndex: number, endIndex: number) => {
        const result = Array.from(list)
        const [removed] = result.splice(startIndex, 1)
        result.splice(endIndex, 0, removed)

        return result
    }

    useEffect(() => {
        console.log(ballotsState)
    }, [ballotsState])

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
