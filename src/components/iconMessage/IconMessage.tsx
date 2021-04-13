import { BulbOutlined, CheckOutlined, CloseCircleOutlined, ExclamationOutlined, FrownOutlined } from '@ant-design/icons'
import { Alert, Button } from 'antd'
import SquareIconContainer from 'components/iconContainer/SquareIconContainer'
import { useAlert } from 'core/hooks/useAlert'
import React, { ReactElement } from 'react'
import { useEffect } from 'react'
import { IIconMessage } from './IIconMessage'

export default function IconMessage({
    label,
    icon,
    alertMessage,
    alertLevel = 'info',
    onClose,
}: IIconMessage): ReactElement {
    const [alert, alertDispatch] = useAlert({ message: alertMessage, alertType: alertLevel })

    useEffect(() => {
        if (typeof alertMessage === 'string') {
            alertDispatch({ type: 'show' })
        }
    })
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
        <div style={{ width: 'auto', position: 'relative' }}>
            {onClose && (
                <Button
                    icon={<CloseCircleOutlined />}
                    style={{ position: 'absolute', border: 'none', right: 0 }}
                    onClick={onClose}
                ></Button>
            )}
            <SquareIconContainer icon={icon} label={label}></SquareIconContainer>
            {!!alertMessage && <div className="mt-20 is-flex has-content-center-center">{alert}</div>}
        </div>
    )
}
