import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { MemoryRouter, Route, Switch } from 'react-router-dom'
import { AuthLevel } from '../../core/service/authentication/AuthLevel'
import { mockMatchMedia } from '../../mocks/mockMatchMedia'
import { ProtectedRoute } from './ProtectedRoute'

let container: HTMLDivElement
const loginContent = 'LOGIN'
const protectedContent = 'PROTECTED'
beforeAll(() => {
    mockMatchMedia()
})
beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
})

afterEach(() => {
    unmountComponentAtNode(container)
})

const App = ({
    isLoggedIn,
    authLevel,
    allowedLevels,
}: {
    isLoggedIn: boolean
    authLevel: AuthLevel
    allowedLevels: Array<AuthLevel>
}) => (
    <div>
        <Switch>
            <Route path="/login" render={() => <div>{loginContent}</div>} />
            <ProtectedRoute exact isLoggedIn={isLoggedIn} authLevel={authLevel} allowedLevels={allowedLevels} path="/">
                <div>{protectedContent}</div>
            </ProtectedRoute>
        </Switch>
    </div>
)

it('should redirect to login if not logged in', async () => {
    const isLoggedIn = false
    const loginLevel = AuthLevel.none
    const allowedLevels = [AuthLevel.authorizer]

    render(
        <MemoryRouter>
            <App isLoggedIn={isLoggedIn} authLevel={loginLevel} allowedLevels={allowedLevels}></App>
        </MemoryRouter>,
        container,
    )
    expect(container.textContent).toBe(loginContent)
})

it('should redirect to login if not logged in and login level set to allowed level', async () => {
    const isLoggedIn = false
    const loginLevel = AuthLevel.authorizer
    const allowedLevels = [AuthLevel.authorizer]

    render(
        <MemoryRouter>
            <App isLoggedIn={isLoggedIn} authLevel={loginLevel} allowedLevels={allowedLevels}></App>
        </MemoryRouter>,
        container,
    )
    expect(container.textContent).toBe(loginContent)
})

it('should display error message if logged in and not appropariate level', async () => {
    const isLoggedIn = true
    const loginLevel = AuthLevel.voter
    const allowedLevels = [AuthLevel.authorizer]

    render(
        <MemoryRouter>
            <App isLoggedIn={isLoggedIn} authLevel={loginLevel} allowedLevels={allowedLevels}></App>
        </MemoryRouter>,
        container,
    )
    expect(container.textContent).not.toBe(protectedContent)
    expect(container.textContent).not.toBe(loginContent)
})
it('should display error message if logged in but no allowed levers is provided', async () => {
    const isLoggedIn = true
    const loginLevel = AuthLevel.voter
    const allowedLevels = [] as Array<AuthLevel>

    render(
        <MemoryRouter>
            <App isLoggedIn={isLoggedIn} authLevel={loginLevel} allowedLevels={allowedLevels}></App>
        </MemoryRouter>,
        container,
    )
    expect(container.textContent).not.toBe(protectedContent)
    expect(container.textContent).not.toBe(loginContent)
})

it('should display the protected page when authenticated and have the correct level', async () => {
    const isLoggedIn = true
    const loginLevel = AuthLevel.authorizer
    const allowedLevels = [AuthLevel.authorizer, AuthLevel.organizer]

    render(
        <MemoryRouter>
            <App isLoggedIn={isLoggedIn} authLevel={loginLevel} allowedLevels={allowedLevels}></App>
        </MemoryRouter>,
        container,
    )
    expect(container.textContent).toBe(protectedContent)
})
