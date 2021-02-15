import { Menu } from 'antd'
import * as React from 'react'

export default function AddBallotMenu(): React.ReactElement {
    return (
        <Menu>
            <Menu.Item>
                <a>Create new ballot</a>
            </Menu.Item>
            <Menu.Item>
                <a>Choose from existing</a>
            </Menu.Item>
        </Menu>
    )
}
