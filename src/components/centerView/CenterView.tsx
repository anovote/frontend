import React, { ReactElement, ReactNode } from 'react'

export default function CenterView({ children }: { children: ReactNode | ReactNode[] }): ReactElement {
    return <div className="center-view">{children}</div>
}
