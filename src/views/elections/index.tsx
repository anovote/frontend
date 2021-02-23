import { Space } from 'antd'
import Title from 'antd/lib/typography/Title'
import React from 'react'

export default function ElectionsView(): React.ReactElement {
    return (
        <div>
            <Title>My elections</Title>
            <Space>
                <div id="upcoming">Container 1</div>
                <div id="in-progress">Container 2</div>
                <div id="finished">Container 3</div>
            </Space>
        </div>
    )
}
