import React from 'react'
import { Route, Switch } from 'react-router-dom'
import NotFound from '../components/routeDefaults/NotFound'
import ChangePassword from './changePassword/ChangePassword'
import Home from './home'
import LoginView from './login'

/**
 * Router view
 * sets up routes for the application.
 * @returns router view for application
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
            <Route path="/change-password">
                <ChangePassword />
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

interface PrivateRouteProps extends RouteProps {
    isLoggedIn: boolean
}

const PrivateRoute = (props: PrivateRouteProps) => {
    const { component: Component, children, ...rest } = props
    return (
        <Route
            {...rest}
            render={(routeProps) =>
                !props.isLoggedIn ? (
                    Component ? (
                        <Component {...routeProps} />
                    ) : (
                        children
                    )
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: { from: routeProps.location },
                        }}
                    />
                )
            }
        />
    )
}
