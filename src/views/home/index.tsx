import Text from 'antd/lib/typography/Text'
import Title from 'antd/lib/typography/Title'
import React from 'react'

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
            <hr />
        </div>
    )
}
