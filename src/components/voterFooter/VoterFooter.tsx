import { Footer } from 'antd/lib/layout/layout'
import React, { ReactElement } from 'react'

export default function VoterFooter(): ReactElement {
    return <Footer className="text-label is-flex justify-content-center">© Anovote {new Date().getFullYear()}</Footer>
}
