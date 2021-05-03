import React, { MouseEventHandler } from 'react'
import { IStatValue } from './IStatValue'
import StatValueContainer from './StatValueContainer'

type Stats = Array<IStatValue>
export default function StatCard(
    {
        stats,
        inverseColors,
        onClick,
    }: { stats: Stats; inverseColors?: boolean; onClick?: MouseEventHandler<HTMLDivElement> } = {
        stats: [],
        inverseColors: false,
    },
): JSX.Element {
    const inverseColorsClass = inverseColors ? 'inverse' : ''
    if (stats.length == 0) {
        stats.push({ title: '_', value: 0 })
    }

    return (
        <div className={`stats-card ${inverseColorsClass}`} onClick={onClick}>
            {stats.map((stat, index) => {
                return <StatValueContainer key={index} title={stat.title} value={stat.value} />
            })}
        </div>
    )
}
