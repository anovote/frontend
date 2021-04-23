import { BallotStatus } from 'core/models/ballot/BallotStatus'
import { ElectionStatus } from 'core/models/election/ElectionStatus'
import * as React from 'react'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StatusLabel, StatusLabelProps, StatusLabelStyle } from './StatusLabel'

export default function ElectionStatusLabel({ status }: { status: ElectionStatus }): ReactElement {
    const [style, setStyle] = React.useState<StatusLabelStyle>('')
    const [title, setTitle] = React.useState<string>('')

    const [t] = useTranslation(['common'])

    const setStyling = () => {
        if (status === ElectionStatus.NotStarted) {
            setStyle('not-started')
            setTitle(t('PLANNED'))
        } else if (status === ElectionStatus.Started) {
            setStyle('started')
            setTitle(t('IN PROGRESS'))
        } else if (status === ElectionStatus.Finished) {
            setStyle('finished')
            setTitle(t('FINISHED'))
        }
    }

    React.useEffect(setStyling)

    return <StatusLabel style={style} title={title} />
}

export function BallotStatusLabel({ status }: { status: BallotStatus }): ReactElement {
    const [t] = useTranslation('common')

    const getBallotStatusTitle = (status: BallotStatus): StatusLabelProps => {
        switch (status) {
            case BallotStatus.IN_QUEUE:
                return { title: t('IN QUEUE'), style: 'not-started' }
            case BallotStatus.IN_PROGRESS:
                return { title: t('IN PROGRESS'), style: 'started' }
            case BallotStatus.IN_RESULT:
                return { title: t('IN RESULT'), style: 'finished' }
            case BallotStatus.IN_ARCHIVE:
                return { title: t('IN ARCHIVE'), style: 'archived' }
            default:
                return { title: '', style: '' }
        }
    }

    const { style, title } = getBallotStatusTitle(status)

    return <StatusLabel style={style} title={title} />
}
