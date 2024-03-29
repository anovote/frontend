import { Card, List } from 'antd'
import React, { ReactElement, ReactNode } from 'react'

/**
 * Creates a Card from Ant d with a list element. The renderItem prop accept a function with a <List.Item><-- your-react-node --></List.Item>
 * @param options for generating the card list
 */
export default function CardList<T>({
    listHeader,
    renderItem,
    list,
    classNames,
    emptyText,
}: {
    listHeader: ReactNode
    renderItem?: (item: T, index: number) => ReactNode
    list?: T[]
    classNames?: string
    emptyText?: ReactNode
}): ReactElement {
    return (
        <Card className={'card-list ' + classNames}>
            <List
                locale={{ emptyText: emptyText }}
                className="card-list-ant-component"
                header={listHeader}
                dataSource={list}
                renderItem={renderItem}
            />
        </Card>
    )
}
