import Item from 'antd/lib/list/Item'
import React, { ReactNode } from 'react'
import { IStatusDetail } from './IStatusDetail'

/**
 * Creates a status list item component to be rendered
 *
 * @param statusItem status details to be displayed
 */
export default function statusListItem(statusItem: IStatusDetail): ReactNode {
    return (
        <Item className={'justify-content-start'}>
            <div className="status-icon-spacer">
                <span className={`${statusItem.colorClass} circle-center-content`}>{statusItem.icon}</span>
            </div>
            <div className={'labels-right'}>
                <div className={'text-label'}>{statusItem.title}</div>
                <div className={'text'}>{statusItem.text}</div>
            </div>
        </Item>
    )
}
