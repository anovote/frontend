import * as React from 'react'
import Text from 'antd/lib/typography/Text'
import { ElectionStatus } from '../core/models/ElectionStatus'
import { useTranslation } from 'react-i18next'

export default function ElectionStatusLabel({ status }: { status: ElectionStatus }): React.ReactElement {
    const [className, setClassName] = React.useState<string>('')
    const [title, setTitle] = React.useState<string>('')

    const [t] = useTranslation(['common'])

    const setStyling = () => {
        if (status === ElectionStatus.NotStarted) {
            setClassName('border-not-started')
            setTitle(t('PLANNED'))
        } else if (status === ElectionStatus.Started) {
            setClassName('border-started')
            setTitle(t('IN PROGRESS'))
        } else if (status === ElectionStatus.Finished) {
            setClassName('border-finished')
            setTitle(t('FINISHED'))
        }
    }

    React.useEffect(setStyling)

    return (
        <span className={`status-container ${className}`}>
            <Text>{title}</Text>
        </span>
    )
}