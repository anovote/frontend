import React from 'react'
import { Link } from 'react-router-dom'

/**
 * Landing page of application and home root
 * @returns the landing page view
 */
export default function Home(): React.ReactElement {
    return (
        <div className="is-flex has-content-center-center">
            <ul>
                <li>
                    <Link to="/join">Join an election</Link>
                </li>
                <li>
                    <Link to="/login">Create and manage elections</Link>
                </li>
            </ul>
        </div>
    )
}
