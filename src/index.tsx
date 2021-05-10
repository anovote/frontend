import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

// for localization
import './i18n'
import { ReactComponent as AnovoteLogo } from 'style/assets/logo-icon.svg'

ReactDOM.render(
    <React.StrictMode>
        <React.Suspense
            fallback={
                <div className="is-fullscreen center-view align-items-center">
                    <AnovoteLogo className="blinking" />
                </div>
            }
        >
            <BrowserRouter>
                <Route path="/" component={App} />
            </BrowserRouter>
        </React.Suspense>
    </React.StrictMode>,
    document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
