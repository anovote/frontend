import { message } from 'antd'
import { ArgsProps, MessageType } from 'antd/lib/message'
import { ReactNode } from 'react'

type Message = ({
    content,
    duration,
    onClose,
    key,
}: {
    content: ReactNode
    duration?: number
    onClose?: () => void
    key?: string | number
}) => MessageType

/**
 * use the message to display messages to user, loading state or other globally available state
 * @returns a message displayed on the screen
 */
export default function useMessage(): {
    info: Message
    success: Message
    error: Message
    loading: Message
    warning: Message
    // eslint-disable-next-line indent
} {
    const DEFAULT_DURATION = 3 // seconds

    const config: ArgsProps = {
        content: '',
        duration: DEFAULT_DURATION,
        type: 'info',
        className: 'anovote-message',
    }

    const setDuration = (duration: number | undefined): number => (duration ? duration : DEFAULT_DURATION)

    const info: Message = ({ content, duration, onClose, key }) => {
        return message.open({
            ...config,
            content,
            type: 'info',
            onClose,
            duration: setDuration(duration),
            key,
        })
    }
    const success: Message = ({ content, duration, onClose, key }) => {
        return message.open({
            ...config,
            content,
            type: 'success',
            onClose,
            duration: setDuration(duration),
            key,
        })
    }
    const error: Message = ({ content, duration, onClose, key }) => {
        return message.open({
            ...config,
            content,
            type: 'error',
            onClose,
            duration: setDuration(duration),
            key,
        })
    }

    const warning: Message = ({ content, duration, onClose, key }) => {
        return message.open({
            ...config,
            content,
            type: 'warning',
            onClose,
            duration: setDuration(duration),
            key,
        })
    }

    const loading: Message = ({ content, duration, onClose, key }) => {
        return message.open({ ...config, content, type: 'loading', onClose, duration: setDuration(duration), key })
    }

    return { info, success, error, loading, warning }
}
