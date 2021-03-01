import { Radio, Form } from 'antd'
import Text from 'antd/lib/typography/Text'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import SelectMultipleIcon from './SelectMultipleIcon'
import SelectOneIcon from './SelectOneIcon'
import SelectRankedIcon from './SelectRankedIcon'

export default function SelectBallotType({ label }: { label: string }): React.ReactElement {
    const [t] = useTranslation(['ballot'])
    const initialValue = 2
    return (
        <Form.Item label={label} name={'ballot-type'} initialValue={initialValue}>
            <div className="radio-wrapper is-flex is-flex-justify-content-center">
                <Radio.Group className="radio-group" defaultValue={initialValue}>
                    <Radio value={1} className="radio-button">
                        <SelectMultipleIcon />
                        <Text className="radio-text select-type-text">{t('ballot:Select multiple')}</Text>
                    </Radio>
                    <Radio value={2} className="radio-button" defaultChecked={true}>
                        <SelectOneIcon />
                        <Text className="radio-text select-type-text">{t('ballot:Select one')}</Text>
                    </Radio>
                    <Radio value={3} className="radio-button">
                        <SelectRankedIcon />
                        <Text className="radio-text select-type-text">{t('ballot:Select ranked')}</Text>
                    </Radio>
                </Radio.Group>
            </div>
        </Form.Item>
    )
}
