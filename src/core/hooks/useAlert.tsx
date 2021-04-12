import { AlertProps, Alert } from 'antd'
import { useState, useEffect } from 'react'
import * as React from 'react'

export function useAlert(props: AnovoteAlertProp): React.ReactElement {
    const [alertProps, setAlertProps] = useState<AlertProps>()

    useEffect(() => {
        setAlertProps({ message: props.message, description: props.description, type: props.type })
    })

    return <Alert message={alertProps?.message} description={alertProps?.description} type={alertProps?.type} />
}

interface AnovoteAlertProp {
    message: string
    description: string
    type: AlertType
}

type AlertType = 'error' | 'warning' | 'success' | 'info'
