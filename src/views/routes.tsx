import React from 'react'
import { Route, Switch } from 'react-router-dom'
import NotFound from '../components/routeDefaults/NotFound'
import Home from './home'
import LoginView from './login'

/**
 * Router view
 * sets up routes for the application.
 * @returns router view for applicaiton
 */
export default function RouterView(): React.ReactElement {
    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route path="/register">
                <LoginView />
            </Route>
            <Route path="/login">
                <LoginView />
            </Route>
            <Route>
                <NotFound />
            </Route>
        </Switch>
    )
}
