/* eslint-disable react/display-name */
import { BallotResultDisplay } from 'core/models/ballot/BallotResultDisplay'
import { BallotStatus } from 'core/models/ballot/BallotStatus'
import { BallotType } from 'core/models/ballot/BallotType'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import * as React from 'react'
import { useCallback, useState } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import AddPreviewButton from './AddPreviewButton'
import PreviewItem from './PreviewItem'

export default function PreviewList(): React.ReactElement {
    const freshBallots: IBallotEntity[] = [
        {
            id: 1,
            title: 'first ballot',
            description: 'this was the first ballot',
            type: BallotType.SINGLE,
            status: BallotStatus.IN_QUEUE,
            candidates: [
                { candidate: 'first', id: 1 },
                { candidate: 'second', id: 2 },
            ],
            image: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
            resultDisplayCount: 1,
            resultDisplayType: BallotResultDisplay.SINGLE,
        },
        {
            id: 2,
            title: 'second ballot',
            description: 'this was the first ballot',
            type: BallotType.SINGLE,
            status: BallotStatus.IN_QUEUE,
            candidates: [
                { candidate: 'first', id: 1 },
                { candidate: 'second', id: 2 },
            ],
            image: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
            resultDisplayCount: 1,
            resultDisplayType: BallotResultDisplay.SINGLE,
        },
        {
            id: 3,
            title: 'third ballot',
            description: 'this was the first ballot',
            type: BallotType.SINGLE,
            status: BallotStatus.IN_QUEUE,
            candidates: [
                { candidate: 'first', id: 1 },
                { candidate: 'second', id: 2 },
            ],
            image: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
            resultDisplayCount: 1,
            resultDisplayType: BallotResultDisplay.SINGLE,
        },
    ]

    const [previews, setPreviews] = React.useState([{ title: 'Helloooo' }])
    const [ballots] = useState<IBallotEntity[]>(freshBallots)

    const addPreview = () => {
        const previewList = [...previews]
        previewList.push({ title: 'Wallah brosjan' })
        setPreviews(previewList)
    }

    const onDragEndHandler = useCallback(() => {
        throw Error('not implemented')
    }, [])

    return (
        <div>
            <DragDropContext onDragEnd={onDragEndHandler}>
                <Droppable droppableId="ballots">
                    {/*{(provided) => <TestList ballots={ballots} {...provided.droppableProps} />}*/}
                    {(dropProvided) => (
                        <div ref={dropProvided.innerRef}>
                            {ballots.map(({ title, id }, index) => {
                                return <PreviewItem key={id} title={title} id={id.toString()} index={index} />
                            })}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <AddPreviewButton addPreview={addPreview} />
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

//interface ListProps {
//    ballots: IBallotEntity[]
//}
