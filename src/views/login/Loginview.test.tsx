// LoginView.test.js

import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { mockMatchMedia } from '../../mocks/mockMatchMedia'

import LoginView from './index'

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

it('displays forms validation on empty fields after submit is clicked', async () => {
    await act(async () => {
        render(<LoginView />, container)
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
})

it('does not displays forms validation message before clicking the submit button', async () => {
    await act(async () => {
        render(<LoginView />, container)
    })
    const list = [...container.querySelectorAll('.ant-form-item-explain')]
    expect(list.length).toBe(0)
})
