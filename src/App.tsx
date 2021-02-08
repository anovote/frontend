import React from 'react'
import 'antd/dist/antd.min.css'
import './style/scss/main.scss'

import LoginView from './views/login'

function App(): React.ReactElement {
    return (
        <div className="App">
            <LoginView />
        </div>
    )
}

export default App
