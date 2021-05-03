import Text from 'antd/lib/typography/Text'
import React, { ReactElement, ReactNode } from 'react'

/**
 * Makes a circular bordered component with the title inside
 * @param style The style of the label
 * @param title The title to be displayed
 * @returns
 */
export function StatusLabel({ style, title }: StatusLabelProps): ReactElement {
    return (
        <div className={`status-container border-${style}`}>
            <Text>{title}</Text>
        </div>
    )
}

export type StatusLabelStyle = 'not-started' | 'started' | 'finished' | 'archived' | ''

export interface StatusLabelProps {
    style: StatusLabelStyle
    title: ReactNode
}
