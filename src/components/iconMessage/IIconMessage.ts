import { AlertState } from 'core/hooks/useAlert'
import { ReactElement, ReactNode } from 'react'

export type AlertLevel = 'info' | 'warning' | 'error' | 'success'
export interface IIconMessage {
    label: string
    alert?: AlertState
    icon?: ReactElement | ReactNode
    onClose?: () => void
}
