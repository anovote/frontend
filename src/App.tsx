import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import 'antd/dist/antd.min.css'
import './style/scss/main.scss'

import RegisterView from './views/register'

function App(): React.ReactElement {
    return (
        <Router>
            <div className="App">
                <RegisterView />
            </div>
        </Router>
    )
}

export default App
