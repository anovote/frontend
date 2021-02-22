import React from 'react'
import 'antd/dist/antd.min.css'
import './style/scss/main.scss'

import Skeleton from './components/Skeleton'
import RouterView from './views/routes'

function App(): React.ReactElement {
    return (
        <div className="App">
            <Skeleton content={<RouterView />} />
        </div>
    )
}

export default App
