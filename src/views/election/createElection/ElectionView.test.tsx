import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { mockMatchMedia } from '../../../mocks/mockMatchMedia'
import CreateElectionView from './index'

let container: Element | DocumentFragment

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

it('Display error on empty fields after create election is clicked', async () => {
    await act(async () => {
        render(
            <CreateElectionView
                initialElection={undefined}
                onAbort={() => {
                    return
                }}
            />,
        )

        fireEvent.submit(screen.getByTestId('description-form'))
    })
    const titleAlert = await screen.findByText('form:Please fill in a title')
    const descriptionAlert = await screen.findByText('form:Please fill in a description')
    expect(titleAlert).toBeTruthy()
    expect(descriptionAlert).toBeTruthy()
})
