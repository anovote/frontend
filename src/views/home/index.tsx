import Title from 'antd/lib/typography/Title'
import Text from 'antd/lib/typography/Text'
import React from 'react'
import ElectionStatusLabel from '../../components/ElectionStatusLabel'
import { ElectionStatus } from '../../core/models/ElectionStatus'

/**
 * Landing page of application and home root
 * @returns the landing page view
 */
export default function Home(): React.ReactElement {
    return (
        <div>
            <Title>This is a title.</Title>
            <Title level={2}>This a subtitle</Title>
            <Title level={3}>This is a paragraph/card title</Title>
            <Text>Normal text</Text>
            <br />
            <Text type="secondary">Label</Text>

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
            <ElectionStatusLabel status={ElectionStatus.Started} />
        </div>
    )
}
