import { useState } from 'react'
import { AnovoteAlertState } from './useAlert'

export function useAlertList(): [AnovoteAlertState[], (newAlertProps: AnovoteAlertState) => void] {
    const [listOfAlerts, setListOfAlerts] = useState<AnovoteAlertState[]>([])

    const addAlertToList = (newAlertProps: AnovoteAlertState) => {
        setListOfAlerts((listOfAlerts) => [...listOfAlerts, newAlertProps])
    }

    return [listOfAlerts, addAlertToList]
}
