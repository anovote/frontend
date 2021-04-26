import Text from 'antd/lib/typography/Text'
import Title from 'antd/lib/typography/Title'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Displays the queue description for a ballot in a ballot queue
 * @param {message, winner} the message to describe the winner. Default message is 'Current leader'
 */
export default function QueueDescription({ message, winner }: { message?: string; winner?: string }): ReactElement {
    const [t] = useTranslation(['common'])

    const heading = message ? message : t('common:Current leader')
    const leader = winner ? winner : '...'

    return (
        <div className="queue-additional">
            <Title level={5}>{heading}</Title>
            <Text>{leader}</Text>
        </div>
    )
}
