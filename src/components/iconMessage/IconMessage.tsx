import { BulbOutlined, CheckOutlined, ExclamationOutlined, FrownOutlined } from '@ant-design/icons'
import { Alert } from 'antd'
import SquareIconContainer from 'components/iconContainer/SquareIconContainer'
import React, { ReactElement } from 'react'
import { IIconMessage } from './IIconMessage'

export default function IconMessage({ label, icon, alertMessage, alertLevel = 'info' }: IIconMessage): ReactElement {
    if (!icon) {
        switch (alertLevel) {
            case 'warning':
                icon = <ExclamationOutlined className="color-warning-contrasting scale-up-center" />
                break
            case 'error':
                icon = <FrownOutlined className="color-danger-contrasting scale-up-center" />
                break
            case 'success':
                icon = <CheckOutlined className="color-success-contrasting scale-up-center" />
                break
            case 'info':
            default:
                icon = <BulbOutlined className="color-info-contrasting scale-up-center" />
                break
        }
    }
    return (
        <>
            <SquareIconContainer icon={icon} label={label}></SquareIconContainer>
            {(!!alertMessage && (
                <div className="mt-20 is-flex has-content-center-center">
                    <Alert type={alertLevel} showIcon={true} message={alertMessage}></Alert>
                </div>
            )) || <></>}
        </>
    )
}
