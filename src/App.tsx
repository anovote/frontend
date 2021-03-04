import React from 'react'
import 'antd/dist/antd.min.css'
import 'style/scss/main.scss'
import { ProvideAppContext } from './core/state/app/AppStateContext'
import RouterView from 'views/routes'

function App(): React.ReactElement {
    return (
        <div className="App">
            <ProvideAppContext>
                <RouterView />
            </ProvideAppContext>
        </div>
    )
}

export default App
