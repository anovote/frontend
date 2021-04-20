import { fireEvent, render, screen } from '@testing-library/react'
import { IElectionEntity } from 'core/models/election/IElectionEntity'
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

describe('update election', () => {
    const election: IElectionEntity = {
        ballots: [],
        closeDate: undefined,
        description: 'fda',
        electionOrganizer: 1,
        eligibleVoters: [],
        id: 5,
        isAutomatic: false,
        isLocked: false,
        openDate: undefined,
        status: 0,
        title: 'adf',
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    it('should have update button', () => {
        render(
            <CreateElectionView
                initialElection={election}
                onUpdate={() => {
                    return
                }}
                onAbort={() => {
                    return
                }}
            />,
        )

        screen.getByText('election:update-election')
    })

    it('should have fields initialized', () => {
        render(
            <CreateElectionView
                initialElection={election}
                onUpdate={() => {
                    return
                }}
                onAbort={() => {
                    return
                }}
            />,
        )

        const title = screen.getByTestId('title') as HTMLInputElement
        expect(title.value).toEqual(election.title)
        const description = screen.getByText(election.description) as HTMLTextAreaElement
        expect(description.value).toEqual(election.description)
    })
})
