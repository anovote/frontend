import React, { useState } from 'react'

export default function VerificationCheckbox(props: any): React.ReactElement {
    const [isClicked, setClicked] = useState<boolean>(false)

    const onSpanClick = () => {
        if (isClicked) {
            setClicked(false)
        } else if (!isClicked) {
            setClicked(true)
        }
    }

    return (
        <span
            className={isClicked ? 'verification-field-clicked' : 'verification-field-not-clicked'}
            onClick={() => onSpanClick()}
        >
            {props.name}
        </span>
    )
}
