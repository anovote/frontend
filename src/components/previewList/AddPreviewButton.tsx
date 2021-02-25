import { Button } from 'antd'
import * as React from 'react'
import { PlusOutlined } from '@ant-design/icons'
export default function AddPreviewButton({ addPreview }: { addPreview: () => void }): React.ReactElement {
    return (
        <div className="add-preview-button-container">
            <Button
                className="add-preview-button"
                type="text"
                shape="circle"
                icon={<PlusOutlined className="btn-icon" />}
                size="large"
                onClick={addPreview}
            />
        </div>
    )
}
