import React, { ReactElement, ReactNode } from 'react'

/**
 * Displays a rounded square with provided icon inside centered. With an optional label beneath the
 * icon.
 */
export default function SquareIconContainer({
    icon,
    label,
    description,
}: {
    icon: ReactNode
    label?: string
    description?: ReactNode
}): ReactElement {
    return (
        <div className="large-icon-container">
            {icon}
            {!!label && <span className="mt-10 text-label mb-10">{label}</span>}
            {!!description && <div className="text">{description}</div>}
        </div>
    )
}
