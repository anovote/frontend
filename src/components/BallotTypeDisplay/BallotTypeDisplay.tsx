import Title from 'antd/lib/typography/Title'
import SelectMultipleIcon from 'components/ballot/selectBallotTypes/SelectMultipleIcon'
import SelectOneIcon from 'components/ballot/selectBallotTypes/SelectOneIcon'
import SelectRankedIcon from 'components/ballot/selectBallotTypes/SelectRankedIcon'
import { BallotType } from 'core/models/ballot/BallotType'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Displays the correct icon and title for a given ballot type
 * @param props {type} the type of a ballot
 * @returns
 */
export default function BallotTypeDisplay({ type }: { type: BallotType }): ReactElement {
    const [t] = useTranslation(['ballot'])
    let icon
    let text
    switch (type) {
        case BallotType.SINGLE:
            text = t('ballot:Select one')
            icon = SelectOneIcon()
            break
        case BallotType.MULTIPLE:
            text = t('ballot:Select multiple')
            icon = SelectMultipleIcon()
            break
        case BallotType.RANKED:
            text = t('ballot:Rank your candidates')
            icon = SelectRankedIcon()
            break
    }
    return (
        <>
            <Title level={4}>{t('ballot:Ballot Type')}</Title>
            <div className="ballot-type">
                <div className="status-icon-spacer ">
                    <span className="circle-center-content">{icon}</span>
                </div>
                <div className={'text'}>{text}</div>
            </div>
        </>
    )
}
