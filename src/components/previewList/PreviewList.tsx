import * as React from 'react'
import AddPreviewButton from './AddPreviewButton'
import PreviewItem from './PreviewItem'

export default function PreviewList(): React.ReactElement {
    const [previews, setPreviews] = React.useState([{ title: 'Helloooo' }])

    const addPreview = () => {
        const previewList = [...previews]
        previewList.push({ title: 'Wallah brosjan' })
        setPreviews(previewList)
    }

    return (
        <div>
            <div>
                {previews.map((previews) => (
                    <PreviewItem key={Math.random()} title={previews.title} />
                ))}
            </div>
            <AddPreviewButton addPreview={addPreview} />
        </div>
    )
}
