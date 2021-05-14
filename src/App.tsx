import Icon from '@ant-design/icons'
import { Spin } from 'antd'
import 'antd/dist/antd.min.css'
import WebSocketManager from 'core/state/websocket/WebSocketManager'
import React from 'react'
import { ReactComponent as SVGLogo } from 'style/assets/logo-icon.svg'
import 'style/scss/main.scss'
import RouterView from 'views/routes'
import { ProvideAppContext } from './core/state/app/AppStateContext'

function App(): React.ReactElement {
    const loaderIcon = <Icon component={SVGLogo} className="blinking" />
    Spin.setDefaultIndicator(loaderIcon)

    return (
        <div className="App">
            <ProvideAppContext>
                <WebSocketManager>
                    <RouterView />
                </WebSocketManager>
            </ProvideAppContext>
        </div>
    )
}

export default App
