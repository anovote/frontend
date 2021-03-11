import { ReactElement, ReactNode } from 'react'

export type AlertLevel = 'info' | 'warning' | 'error' | 'success'
export interface IIconMessage {
    label: string
    alertMessage?: string
    alertLevel?: AlertLevel
    icon?: ReactElement | ReactNode
}
