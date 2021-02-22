import React from 'react'
import 'antd/dist/antd.min.css'
import './style/scss/main.scss'

import Header from './components/Header'
import RouterView from './views/routes'
import { ProvideAppContext } from './core/state/app/AppStateContext'

function App(): React.ReactElement {
    return (
        <div className="App">
            <ProvideAppContext>
                <Header />
                <RouterView />
            </ProvideAppContext>
        </div>
    )
}

export default App
