import { Space } from 'antd'
import React, { ReactElement } from 'react'
export default function IconButton({
    reverse,
    text,
    classId,
    tabIndex,
    disabled = false,
    color,
    icon,
    onClick,
}: {
    reverse?: boolean
    text: string
    classId?: string
    tabIndex?: number
    disabled?: boolean
    color?: 'danger' | 'info' | 'success'
    icon: ReactElement
    onClick?: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}): ReactElement {
    const classReverse = reverse ? 'is-flex-row-reverse' : ''
    return (
        <button
            disabled={disabled}
            onClick={(event) => onClick && onClick(event)}
            className={`anovote-button-style icon-button ${color ? color : 'main'}-light ${classReverse}`}
            tabIndex={tabIndex}
            id={classId}
        >
            <Space size={'middle'}>
                {text}
                <div className={`circle-center-content ${color ? color : 'main'}-contrasting`}>{icon}</div>
            </Space>
        </button>
    )
}
