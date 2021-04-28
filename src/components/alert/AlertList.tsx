import { Alert } from 'antd'
import { AlertState, useAlert } from 'core/hooks/useAlert'
import React, { ReactElement } from 'react'

export interface AlertListProps {
    alerts: AlertState[]
}

//todo #229 when an alert is closed it should remove itself from the alerts array. This can be done with the `afterClose` prop on the alert component
export const AlertList = ({ alerts }: AlertListProps): ReactElement => {
    const { dispatchAlert } = useAlert(alerts)
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
                        afterClose={() => dispatchAlert({ type: 'remove', index })}
                    />
                )
            })}
        </div>
    )
}
