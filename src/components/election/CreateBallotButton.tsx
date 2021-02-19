import * as React from 'react'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

export default function CreateBallotButton({ addBallot }: { addBallot: () => void }): React.ReactElement {
    return (
        <div>
            <Button
                className="create-ballot-button"
                type="primary"
                shape="circle"
                icon={<PlusOutlined />}
                size="large"
                onClick={addBallot}
            />
        </div>
    )
}
