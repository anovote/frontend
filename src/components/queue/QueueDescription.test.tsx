import React, { Component } from 'react'
import Enzyme, { mount, ReactWrapper, shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import Text from 'antd/lib/typography/Text'
import Title from 'antd/lib/typography/Title'

Enzyme.configure({ adapter: new Adapter() })

import QueueDescription from './QueueDescription'

describe('Queue description', () => {
    beforeAll(() => {
        jest.mock('react-i18next', () => ({
            useTranslation: () => {
                return {
                    t: (str: string) => str,
                    i18n: () => {
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        new Promise(() => {})
                    },
                }
            },
        }))
    })
    it('should set winner when prop is assigned', () => {
        const wrapper = mount(<QueueDescription winner="John Doe" />)

        expect(wrapper.find(Text).text()).toBe('John Doe')
    })

    it('should set message to current leader if no prop is given', () => {
        const wrapper = mount(<QueueDescription winner="John Doe" />)

        expect(wrapper.find(Title).text()).toBe('common:Current leader')
    })

    it('should set message to provided message when prop is given', () => {
        const wrapper = mount(<QueueDescription message="Winner" winner="John Doe" />)

        expect(wrapper.find(Title).text()).toBe('Winner')
    })
})
