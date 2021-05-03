import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { mockMatchMedia } from 'mocks/mockMatchMedia'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import LoginView from './index'

beforeAll(() => {
    mockMatchMedia()
})

it('displays forms validation on empty fields after submit is clicked', async () => {
    render(
        <MemoryRouter>
            <LoginView />
        </MemoryRouter>,
    )

    fireEvent.click(await screen.findByText('common:Log In'))

    await waitFor(
        () => {
            screen.getByText('form:Please provide email')
            screen.getByText('form:Please provide a password')
        },
        { timeout: 200 },
    )
})

it('does not displays forms validation message before clicking the submit button', async () => {
    render(
        <MemoryRouter>
            <LoginView />
        </MemoryRouter>,
    )

    await waitFor(
        () => {
            expect(screen.queryByRole('alert')).not.toBeInTheDocument()
        },
        { timeout: 200 },
    )
})
