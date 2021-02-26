import Title from 'antd/lib/typography/Title'
import Text from 'antd/lib/typography/Text'
import React from 'react'

import SwitchWithLabel from '../../components/switch/SwitchWithLabel'
import StatCard from 'components/statCard/StatCard'
import SelectResultType from '../../components/SelectResultType'

/**
 * Landing page of application and home root
 * @returns the landing page view
 */
export default function Home(): React.ReactElement {
    const a = [{ title: 'Total', value: 343 }]
    const b = [
        { title: 'Total', value: 99999 },
        { title: 'Votes', value: 3343 },
        { title: 'Votes', value: 94 },
    ]
    return (
        <div>
            <Title>This is a title.</Title>
            <Title level={2}>This a subtitle</Title>
            <Title level={3}>This is a paragraph/card title</Title>
            <Text>Normal text</Text>
            <br />
            <Text type="secondary">Label</Text>
            <StatCard stats={a} inverseColors={true} />
            <StatCard stats={b} />
            <hr />
            <div id="colors">
                <span className="round">
                    <span className="inner-round"></span>
                </span>
                <span className="round">
                    <span className="inner-round"></span>
                </span>
                <span className="round">
                    <span className="inner-round"></span>
                </span>
                <span className="round">
                    <span className="inner-round"></span>
                </span>
            </div>
            <SelectResultType />
        </div>
    )
}
