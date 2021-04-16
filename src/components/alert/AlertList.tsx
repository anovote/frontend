import { Alert } from 'antd'
import { AlertState } from 'core/hooks/useAlert'
import * as React from 'react'
import { FC } from 'react'

export interface AlertListProps {
    alerts: AlertState[]
}

export const AlertList: FC<AlertListProps> = ({ alerts }: AlertListProps) => {
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
