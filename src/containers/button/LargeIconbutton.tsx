import React, { ReactElement } from 'react'
export default function LargeIconButton({
    reverse,
    text,
    classId,
    height,
    tabIndex,
    children,
    onClick,
}: {
    reverse?: boolean
    text: string
    classId?: string
    height?: string
    tabIndex: number
    children?: ReactElement
    onClick: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}): ReactElement {
    const classReverse = reverse ? 'is-flex-row-reverse' : ''
    return (
        <button
            style={{ height: `${height}` }}
            onClick={(event) => onClick(event)}
            className={`large-icon-button main-light ${classReverse}`}
            tabIndex={tabIndex}
            id={classId}
        >
            <div>{text}</div>
            {children}
        </button>
    )
}
