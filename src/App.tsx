import React from 'react'
import 'antd/dist/antd.min.css'
import './style/scss/main.scss'
import RegisterView from './views/register'
function App(): React.ReactElement {
    return (
        <div className="App">
            <RegisterView />
        </div>
    )
}

export default App
