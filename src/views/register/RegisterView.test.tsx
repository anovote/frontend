import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
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

it('Should display error if password does not match criteria', async () => {
    render(<RegisterView />)
    const passwordInput = screen.getByLabelText('common:Password')
    fireEvent.change(passwordInput, { target: { value: 'a' } })

    await waitFor(
        () => {
            screen.getByText('form:Password validation')
            screen.getByText('form:min-length')
            screen.getAllByText('form:Must have at least one')
        },
        { timeout: 200 },
    )
})

it('Should not display error if password does match criteria', async () => {
    render(<RegisterView />)
    const passwordInput = screen.getByLabelText('common:Password')
    fireEvent.change(passwordInput, { target: { value: 'aBc1!24f' } })

    await waitFor(
        () => {
            expect(screen.queryAllByRole('alert').length).toBe(0)
        },
        { timeout: 200 },
    )
})

it('should show error if retype password does not match password', async () => {
    render(<RegisterView />)
    const passwordInput = screen.getByLabelText('common:Password')
    const rePasswordInput = screen.getByLabelText('form:Please rewrite password')
    fireEvent.change(passwordInput, { target: { value: 'aBc1!24f' } })
    fireEvent.change(rePasswordInput, { target: { value: 'adfa' } })

    await waitFor(
        () => {
            screen.getByText('form:Must be equal')
        },
        { timeout: 200 },
    )
})
