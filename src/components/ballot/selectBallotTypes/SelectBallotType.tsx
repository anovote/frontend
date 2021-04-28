import { Form, Radio } from 'antd'
import Text from 'antd/lib/typography/Text'
import ComponentWithTooltip from 'components/toolTip/ComponentWithTooltip'
import { BallotType } from 'core/models/ballot/BallotType'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
//import SelectMultipleIcon from './SelectMultipleIcon'
import SelectOneIcon from './SelectOneIcon'
//import SelectRankedIcon from './SelectRankedIcon'

export default function SelectBallotType({
    label,
    initialValue = BallotType.SINGLE,
}: {
    label: string
    initialValue?: BallotType
}): React.ReactElement {
    const [t] = useTranslation(['ballot'])
    return (
        <Form.Item
            label={
                <ComponentWithTooltip
                    component={<Text>{label}</Text>}
                    toolTipTitle={t('ballot:Select the type of ballot that you want the voters to vote on')}
                />
            }
            name={'ballot-type'}
            initialValue={initialValue}
        >
            <div className="radio-wrapper is-flex is-flex-justify-content-center">
                <Radio.Group className="radio-group" defaultValue={initialValue}>
                    {/* todo #155 implement logic for handling different types of ballots
                    <Radio value={BallotType.MULTIPLE} className="radio-button">
                        <SelectMultipleIcon />
                        <Text className="radio-text select-type-text">{t('ballot:Select multiple')}</Text>
                    </Radio>*/}
                    <Radio value={BallotType.SINGLE} className="radio-button" defaultChecked={true}>
                        <SelectOneIcon />
                        <Text className="radio-text select-type-text">{t('ballot:Select one')}</Text>
                    </Radio>
                    {/*<Radio value={BallotType.RANKED} className="radio-button">
                        <SelectRankedIcon />
                        <Text className="radio-text select-type-text">{t('ballot:Select ranked')}</Text>
                    </Radio>*/}
                </Radio.Group>
            </div>
        </Form.Item>
    )
}
