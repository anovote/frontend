import { Alert } from 'antd'
import { AlertState } from 'core/hooks/useAlert'
import React, { ReactElement } from 'react'

export interface AlertListProps {
    alerts: AlertState[]
}

export const AlertList = ({ alerts }: AlertListProps): ReactElement => {
    return (
        <div>
            {alerts.map(function (props, index) {
                return (
                    <Alert
                        key={index}
                        message={props.message}
                        description={props.description}
                        type={props.level}
                        showIcon
                        closable
                    />
                )
            })}
        </div>
    )
}
