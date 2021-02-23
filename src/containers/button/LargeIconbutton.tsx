import React, { ReactElement } from 'react'
export default function LargeIconButton({
    reverse,
    text,
    children,
    onClick,
}: {
    reverse?: boolean
    text: string
    children?: ReactElement
    onClick: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}): ReactElement {
    const classReverse = reverse ? 'is-flex-row-reverse' : ''
    return (
        <button onClick={(event) => onClick(event)} className={`large-icon-button main-light ${classReverse}`}>
            <div>{text}</div>
            {children}
        </button>
    )
}
