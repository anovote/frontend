import { Form, Radio } from 'antd'
import * as React from 'react'
import { ReactComponent as NoneIcon } from 'style/assets/none.svg'
import { ReactComponent as SingleWinnerIcon } from 'style/assets/single.svg'
import { ReactComponent as RankedIcon } from 'style/assets/ranked.svg'
import Text from 'antd/lib/typography/Text'
import { useTranslation } from 'react-i18next'

export default function SelectResultType({ label }: { label: string }): React.ReactElement {
    const [t] = useTranslation(['common'])
    const initialValue = 2
    return (
        <Form.Item label={label} name="select-result-type" initialValue={initialValue} className="spread">
            <div className="radio-wrapper is-flex is-flex-justify-content-center">
                <Radio.Group className="radio-group" defaultValue={initialValue}>
                    <Radio value={1} className="radio-button">
                        <NoneIcon className="none-icon" />
                        <Text className="radio-text select-none-text">{t('None')}</Text>
                    </Radio>
                    <Radio value={2} className="radio-button" defaultChecked={true} checked={true}>
                        <SingleWinnerIcon className="single-icon" />
                        <Text className="radio-text select-single-text">{t('Single winner')}</Text>
                    </Radio>
                    <Radio value={3} className="radio-button">
                        <RankedIcon className="ranked-icon" />
                        <Text className="radio-text select-ranked-text">{t('Ranked')}</Text>
                    </Radio>
                </Radio.Group>
            </div>
        </Form.Item>
    )
}
