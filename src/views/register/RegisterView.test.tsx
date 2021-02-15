import React from 'react'
import { unmountComponentAtNode, render } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { mockMatchMedia } from '../../mocks/mockMatchMedia'
import RegisterView from './index'

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

it('Displays forms validation on empty fields after register is clicked', async () => {
    await act(async () => {
        render(<RegisterView />, container)
        container.querySelector('button')?.click()
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

it('Does not display form validation alert message before clicking the register button', async () => {
    await act(async () => {
        render(<RegisterView />, container)
    })
    const list = [...container.querySelectorAll('.ant-form-item-explain')]
    expect(list.length).toBe(0)
})
