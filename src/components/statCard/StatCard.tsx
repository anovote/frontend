import React from 'react'
import StatValueContainer from './StatValueContainer'

export interface IStatValue {
    title: string
    value: number
}
type Stats = Array<IStatValue>

export default function StatCard({ stats }: { stats: Stats } = { stats: [] }): JSX.Element {
    if (stats.length == 0) {
        stats.push({ title: '_', value: 0 })
    }
    return (
        <div className="stats-card inverse">
            {stats.map((stat, index) => {
                return <StatValueContainer key={index} title={stat.title} value={stat.value} />
            })}
        </div>
    )
}
