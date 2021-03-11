import { useState } from 'react'
import { IIconMessage } from './IIconMessage'

export default function useIconMessageState(initialState: IIconMessage): [IIconMessage, React.Dispatch<IIconMessage>] {
    return useState<IIconMessage>(initialState)
}
