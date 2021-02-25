import * as React from 'react'
import { Dropdown, Button } from 'antd'
import ImportMenu from './ImportMenu'
import { PlusOutlined } from '@ant-design/icons'

export default function ImportElectionAuthoritiesDropdown(): React.ReactElement {
    return (
        <Dropdown overlay={<ImportMenu />} placement="bottomRight" arrow>
            <Button className="import-menu-button" type="primary" shape="circle" icon={<PlusOutlined />} size="large" />
        </Dropdown>
    )
}
