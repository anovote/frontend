import React, { ReactNode } from 'react'

export default function CenterView({ children }: { children: ReactNode | ReactNode[] }) {
    return <div className="center-view">{children}</div>
}
