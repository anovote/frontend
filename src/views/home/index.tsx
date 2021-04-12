import { useAlert } from 'core/hooks/useAlert'
import React from 'react'
import { Link } from 'react-router-dom'

/**
 * Landing page of application and home root
 * @returns the landing page view
 */
export default function Home(): React.ReactElement {
    const [alert, alertDispatcher] = useAlert({
        message: 'Very nice alert',
        description: 'The very nice description',
        type: 'error',
    })

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
            <button
                onClick={() => {
                    alertDispatcher({
                        type: 'show',
                        alertProps: { message: 'test', description: 'kfodk', type: 'info' },
                    })
                }}
            >
                Alert
            </button>
            <button
                onClick={() => {
                    alertDispatcher({ type: 'close' })
                }}
            >
                close
            </button>
            {alert}
        </div>
    )
}
