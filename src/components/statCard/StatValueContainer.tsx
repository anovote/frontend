import React from 'react'
import { IStatValue } from './IStatValue'

export default function StatValueContainer({ title, value }: IStatValue): JSX.Element {
    return (
        <div className="stat">
            <div className="stat-title">{title}</div>
            <div className="stat-value">{value}</div>
        </div>
    )
}
