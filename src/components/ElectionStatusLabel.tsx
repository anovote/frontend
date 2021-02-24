import * as React from 'react'
import Title from 'antd/lib/typography/Title'
import { ElectionStatus } from '../core/models/ElectionStatus'

export default function ElectionStatusLabel({ status }: { status: ElectionStatus }): React.ReactElement {
    const [className, setClassName] = React.useState<string>('')
    const [title, setTitle] = React.useState<string>('')

    const setStyling = () => {
        if (status === ElectionStatus.NotStarted) {
            setClassName('election-status-container election-not-started-container')
            setTitle('PLANNED')
        } else if (status === ElectionStatus.Started) {
            setClassName('election-status-container election-started-container')
            setTitle('IN PROGRESS')
        } else if (status === ElectionStatus.Finished) {
            setClassName('election-status-container election-finished-container')
            setTitle('FINISHED')
        }
    }

    React.useEffect(setStyling)

    return (
        <div className={className}>
            <Title level={3}>{title}</Title>
        </div>
    )
}
