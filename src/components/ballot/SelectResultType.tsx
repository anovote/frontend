import { Form, Radio } from 'antd'
import Text from 'antd/lib/typography/Text'
import { BallotResultDisplay } from 'core/models/ballot/BallotResultDisplay'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { ReactComponent as SingleWinnerIcon } from 'style/assets/single.svg'

export default function SelectResultType({
    label,
    initialValue = BallotResultDisplay.SINGLE,
}: {
    label: string
    initialValue?: BallotResultDisplay
}): React.ReactElement {
    const [t] = useTranslation(['common'])
    return (
        <Form.Item
            label={label}
            tooltip={t('ballot:Select how you want the result of the ballot displayed')}
            name="select-result-type"
            initialValue={initialValue}
            className="spread"
        >
            <div className="radio-wrapper is-flex is-flex-justify-content-center">
                <Radio.Group className="radio-group" defaultValue={initialValue}>
                    {/* todo #156 implement ballot result display options
                    <Radio value={BallotResultDisplay.NONE} className="radio-button">
                        <NoneIcon className="none-icon" />
                        <Text className="radio-text select-none-text">{t('None')}</Text>
                    </Radio>*/}
                    <Radio
                        value={BallotResultDisplay.SINGLE}
                        className="radio-button"
                        defaultChecked={true}
                        checked={true}
                    >
                        <SingleWinnerIcon className="single-icon" />
                        <Text className="radio-text select-single-text">{t('Single winner')}</Text>
                    </Radio>
                    {/*<Radio value={BallotResultDisplay.RUNNER_UP} className="radio-button">
                        <RankedIcon className="ranked-icon" />
                        <Text className="radio-text select-ranked-text">{t('Ranked')}</Text>
                    </Radio>*/}
                </Radio.Group>
            </div>
        </Form.Item>
    )
}
