import { Alert } from 'antd'
import { AlertState } from 'core/hooks/useAlert'
import React, { ReactElement } from 'react'

export interface AlertListProps {
    /** The alerts to generate the alert list from */
    alerts: AlertState[]
    /**
     * The onRemove action to fire after close on the alert.
     * Usually combined with the useAlert hook 'remove'
     */
    onRemove?: (index: number) => void
}

/**
 * Returns a list of alerts generated from the alerts prop. The list can be populated to dispatch an remove action if wanted.
 * If no onRemove function is supplied, the closeable prop for the alert will not be shown, and making it not possible for the user to choose
 * @param {alerts, onRemove} the possible props for the component
 * @returns
 */
export const AlertList = ({ alerts, onRemove }: AlertListProps): ReactElement => {
    return (
        <div>
            {alerts.map(function (props, index) {
                return (
                    props.message && (
                        <Alert
                            key={index}
                            message={props.message}
                            description={props.description}
                            type={props.level}
                            showIcon
                            closable={!!onRemove}
                            afterClose={() => {
                                if (onRemove) onRemove(index)
                            }}
                        />
                    )
                )
            })}
        </div>
    )
}
