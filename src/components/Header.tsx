import React from 'react'
import { Link } from 'react-router-dom'

/**
 * Header component for applicaiton
 * just a simpple nav bar to demonstrate how the router works
 */
function Header(): React.ReactElement {
    return (
        <nav className="navbar navbar-light">
            <ul className="nav navbar-nav">
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/login">Login</Link>
                </li>
                <li>
                    <Link to="/register">Register</Link>
                </li>
                <li>
                    <Link to="/election/createElection">Create Election</Link>
                </li>
                <li>
                    <Link to="/change-password">Change password</Link>
                </li>
            </ul>
        </nav>
    )
}

export default Header
