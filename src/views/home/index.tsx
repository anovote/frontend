import Text from 'antd/lib/typography/Text'
import Title from 'antd/lib/typography/Title'
import BallotsQueue from 'components/queue/BallotsQueue'
import { BallotEntity } from 'core/models/ballot/BallotEntity'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import React from 'react'

/**
 * Landing page of application and home root
 * @returns the landing page view
 */
export default function Home(): React.ReactElement {
    const data: IBallotEntity[] = [
        {
            id: 1,
            title:
                'First election, First election, First election, First election, First election, First electionFirst election, First election, First election, First election, First election, First election',
            description: 'This is the first of all elections',
            status: 0,
            candidates: [],
            image: '',
            type: 0,
            resultDisplayCount: 0,
            resultDisplayType: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 2,
            title: 'Second election',
            description: 'Very important question here',
            status: 0,
            candidates: [],
            image: '',
            type: 0,
            resultDisplayCount: 0,
            resultDisplayType: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 3,
            title: 'Third election',
            description: 'This is the first of all elections',
            status: 0,
            candidates: [],
            image: '',
            type: 0,
            resultDisplayCount: 0,
            resultDisplayType: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 4,
            title: 'Fourth election',
            description: 'Make me proud daddy',
            status: 0,
            candidates: [],
            image: '',
            type: 0,
            resultDisplayCount: 0,
            resultDisplayType: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 5,
            title: 'Big election',
            description: 'Hello hello hello',
            status: 0,
            candidates: [],
            image: '',
            type: 0,
            resultDisplayCount: 0,
            resultDisplayType: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 6,
            title: 'Hello election',
            description: 'Big big win',
            status: 0,
            candidates: [],
            image: '',
            type: 0,
            resultDisplayCount: 0,
            resultDisplayType: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 1,
            title:
                'First election, First election, First election, First election, First election, First electionFirst election, First election, First election, First election, First election, First election',
            description: 'This is the first of all elections',
            status: 0,
            candidates: [],
            image: '',
            type: 0,
            resultDisplayCount: 0,
            resultDisplayType: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 2,
            title: 'Second election',
            description: 'Very important question here',
            status: 0,
            candidates: [],
            image: '',
            type: 0,
            resultDisplayCount: 0,
            resultDisplayType: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 3,
            title: 'Third election',
            description: 'This is the first of all elections',
            status: 0,
            candidates: [],
            image: '',
            type: 0,
            resultDisplayCount: 0,
            resultDisplayType: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 4,
            title: 'Fourth election',
            description: 'Make me proud daddy',
            status: 0,
            candidates: [],
            image: '',
            type: 0,
            resultDisplayCount: 0,
            resultDisplayType: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 5,
            title: 'Big election',
            description: 'Hello hello hello',
            status: 0,
            candidates: [],
            image: '',
            type: 0,
            resultDisplayCount: 0,
            resultDisplayType: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 6,
            title: 'Hello election',
            description: 'Big big win',
            status: 0,
            candidates: [],
            image: '',
            type: 0,
            resultDisplayCount: 0,
            resultDisplayType: 0,
            updatedAt: new Date(),
        },
        {
            id: 1,
            title:
                'First election, First election, First election, First election, First election, First electionFirst election, First election, First election, First election, First election, First election',
            description: 'This is the first of all elections',
            status: 0,
            candidates: [],
            image: '',
            type: 0,
            resultDisplayCount: 0,
            resultDisplayType: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 2,
            title: 'Second election',
            description: 'Very important question here',
            status: 0,
            candidates: [],
            image: '',
            type: 0,
            resultDisplayCount: 0,
            resultDisplayType: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 3,
            title: 'Third election',
            description: 'This is the first of all elections',
            status: 0,
            candidates: [],
            image: '',
            type: 0,
            resultDisplayCount: 0,
            resultDisplayType: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 4,
            title: 'Fourth election',
            description: 'Make me proud daddy',
            status: 0,
            candidates: [],
            image: '',
            type: 0,
            resultDisplayCount: 0,
            resultDisplayType: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 5,
            title: 'Big election',
            description: 'Hello hello hello',
            status: 0,
            candidates: [],
            image: '',
            type: 0,
            resultDisplayCount: 0,
            resultDisplayType: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 6,
            title: 'Hello election',
            description: 'Big big win',
            status: 0,
            candidates: [],
            image: '',
            type: 0,
            resultDisplayCount: 0,
            resultDisplayType: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ]

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

            <BallotsQueue dataSource={data as BallotEntity[]} />
        </div>
    )
}
