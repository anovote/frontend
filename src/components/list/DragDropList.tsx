import React, { ReactElement, ReactNode } from 'react'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'

type DraggableProps<T> = {
    // a unique id for representing the droppable id column
    droppableId: string
    /**
     * Each individual node that should populate the list,
     * that will contain drag and drop properties.
     */
    children: (item: T, index: number) => ReactNode
    /**
     * The list to iterate over.
     * The list must have a id field
     */
    list: T[]
    /**
     * A method fired when a drag has ended
     */
    onDragEndHandler: (result: DropResult) => void
}

interface ObjectWithId {
    id: string | number
}
interface ObjectWithIndex {
    index: number
}

/**
 *  Makes a list draggable by giving each element in list drag and drop handlers.
 * The component can take in any list, as well as any ReactNode to use. The only constraint is that the list must have an id field
 */
export default function DragDropList<T extends ObjectWithId | ObjectWithIndex>({
    children,
    list,
    droppableId,
    onDragEndHandler,
}: DraggableProps<T>): ReactElement {
    return (
        <>
            <DragDropContext onDragEnd={onDragEndHandler}>
                <Droppable droppableId={droppableId}>
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
