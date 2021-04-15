import { Alert } from 'antd'
import { AnovoteAlertState } from 'core/hooks/useAlert'
import React from 'react'
import { FC } from 'react'

export interface AlertListProps {
    alertProps: AnovoteAlertState[]
}

export const AlertList: FC<AlertListProps> = ({ alertProps }: AlertListProps) => {
    return (
        <div>
            {alertProps.map(function (props, index) {
                return (
                    <Alert
                        key={index}
                        message={props.message}
                        description={props.description}
                        type={props.alertType}
                        showIcon
                        closable
                    />
                )
            })}
        </div>
    )
}
