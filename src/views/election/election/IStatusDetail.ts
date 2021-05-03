import { ReactNode } from 'react'

export interface IStatusDetail {
    icon: ReactNode
    colorClass: string
    title: string
    text: string | ReactNode
}
