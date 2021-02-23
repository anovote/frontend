import { Radio } from 'antd'
import Text from 'antd/lib/typography/Text'
import * as React from 'react'
import SelectMultipleIcon from './SelectMultipleIcon'
import SelectOneIcon from './SelectOneIcon'

export default function SelectBallotType(): React.ReactElement {
    return (
        <Radio.Group>
            <Radio value={1}>
                <SelectMultipleIcon />
                <Text className="select-ballot-type-text">Select multiple</Text>
            </Radio>
            <Radio value={2}>
                <SelectOneIcon />
                <Text className="select-ballot-type-text">Select one</Text>
            </Radio>
            <Radio value={3}>
                <Text className="select-ballot-type-text">Select ranked</Text>
            </Radio>
        </Radio.Group>
    )
}
