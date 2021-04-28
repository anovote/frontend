import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { mockMatchMedia } from '../../mocks/mockMatchMedia'
import RegisterView from './index'

beforeAll(() => {
    mockMatchMedia()
})

it('Displays forms validation on empty fields after register is clicked', async () => {
    await act(async () => {
        render(<RegisterView />)
        const button = await screen.findByText('form:Register')
        userEvent.click(button)
    })

    await waitFor(
        () => {
            const NUMBER_OF_REQUIRED_FIELDS = 5

            screen.getByText('form:Remember first name')
            screen.getByText('form:Remember last name')
            screen.getByText('form:Remember email')
            screen.getByText('form:Remember password')
            screen.getByText('form:Remember to rewrite password')
            expect(screen.getAllByRole('alert').length).toBe(NUMBER_OF_REQUIRED_FIELDS)
        },
        { timeout: 200 },
    )
})

it('Does not display form validation alert message before clicking the register button', async () => {
    render(<RegisterView />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})
