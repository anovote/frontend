import { Menu } from 'antd'
import * as React from 'react'

export default function ImportMenu(): React.ReactElement {
    return (
        <Menu>
            <Menu.Item>
                <a>CSV</a>
            </Menu.Item>
            <Menu.Item>
                <a>Excel</a>
            </Menu.Item>
            <Menu.Item>
                <a>Word</a>
            </Menu.Item>
        </Menu>
    )
}
