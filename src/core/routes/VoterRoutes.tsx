import React, { ReactElement } from 'react'
import { Route } from 'react-router'
import Room from 'views/election/room'

export default function VoterRoutes(): ReactElement {
    return (
        <>
            <Route path="room">
                <Room />
            </Route>
        </>
    )
}
