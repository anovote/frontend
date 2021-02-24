import React from 'react'
import 'antd/dist/antd.min.css'
import './style/scss/main.scss'

import Header from 'components/Header'
import RouterView from 'views/routes'

function App(): React.ReactElement {
    return (
        <div className="App">
            <Header />
            <RouterView />
        </div>
    )
}

export default App
