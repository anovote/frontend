import React, { ReactElement, ReactNode } from 'react'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'

type DraggableProps<T> = {
    children: (item: T, index: number) => ReactNode
    list: T[]
    onDragEndHandler: (result: DropResult) => void
}

interface ObjectWithId {
    id: string | number
}

export default function DraggableList<T extends ObjectWithId>({
    children,
    list,
    onDragEndHandler,
}: DraggableProps<T>): ReactElement {
    return (
        <>
            <DragDropContext onDragEnd={onDragEndHandler}>
                <Droppable droppableId="ballots">
                    {(dropProvided) => (
                        <div ref={dropProvided.innerRef}>
                            {list.map((item: T, index: number) => {
                                return (
                                    <Draggable key={index} draggableId={index.toString()} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                key={index}
                                            >
                                                {children(item, index)}
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
        </>
    )
}
