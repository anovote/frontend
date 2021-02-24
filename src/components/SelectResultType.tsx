import { Radio } from 'antd'
import * as React from 'react'
import Text from 'antd/lib/typography/Text'

export default function SelectResultType(): React.ReactElement {
    return (
        <div className="radio-wrapper">
            <Radio.Group className="radio-group">
                <Radio value={1} className="radio-button">
                    <Text className="select-type-text">None</Text>
                </Radio>
                <Radio value={2} className="radio-button">
                    <Text className="select-type-text">Single winner</Text>
                </Radio>
                <Radio value={3} className="radio-button">
                    <Text className="select-type-text">Ranked</Text>
                </Radio>
            </Radio.Group>
        </div>
    )
}
