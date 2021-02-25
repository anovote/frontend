import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
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
        render(<CreateElectionView />, container)
        const btn: HTMLButtonElement = container.querySelector('.create-election-button') as HTMLButtonElement
        btn?.click()
        return await new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, 200)
        })
    })
    const list = [...container.querySelectorAll('.ant-form-item-explain')]
    expect(list[0]).toBeTruthy()
    expect(list[1]).toBeTruthy()
    expect(list[2]).toBeTruthy()
    expect(list[3]).toBeTruthy()
    expect(list[4]).toBeTruthy()
})
