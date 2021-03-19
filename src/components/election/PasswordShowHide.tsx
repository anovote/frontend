import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { Space } from 'antd'
import React, { ReactElement, useState } from 'react'

/**
 * Creates a field to display a password. The password is hidden by default
 * Can be shown by hovering the field, or by toggle it on by clicking the field
 * @param props Object with the password to be shown
 * @returns A toggle password field
 */
export function PasswordShowHide({ password }: { password: string }): ReactElement {
    const [hide, setHide] = useState(true)
    const [toggleHideOn, setToggleHideOn] = useState(false)

    const hiddenPassword = '••••••••'

    const toggleHide = () => {
        //setHide(!hide)
        setToggleHideOn(!toggleHideOn)
    }

    return (
        <>
            <Space>
                <text onClick={toggleHide} onMouseEnter={() => setHide(false)} onMouseLeave={() => setHide(true)}>
                    {hide && !toggleHideOn ? hiddenPassword : password}
                </text>
                <span onClick={toggleHide}>{!toggleHideOn ? <EyeInvisibleOutlined /> : <EyeOutlined />}</span>
            </Space>
        </>
    )
}
