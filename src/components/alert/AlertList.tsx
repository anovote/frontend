import { Alert } from 'antd'
import { AlertState, useAlert } from 'core/hooks/useAlert'
import React, { ReactElement, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router'

export interface AlertListProps {
    alerts: AlertState[]
}

export const AlertList = ({ alerts }: AlertListProps): ReactElement => {
    const { alertStates, dispatchAlert } = useAlert(alerts)
    const history = useHistory()
    const location = useLocation<AlertState>()

    useEffect(() => {
        if (location.state) {
            dispatchAlert({
                type: 'add',
                level: location.state.level,
                message: location.state.message,
                description: location.state.description,
            })
        }
        history.replace({ ...history.location, state: {} as AlertState })
    }, [])

    return (
        <div>
            {[...alerts, ...alertStates].map(function (props, index) {
                return (
                    props.message && (
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
                )
            })}
        </div>
    )
}
