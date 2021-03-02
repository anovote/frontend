import * as React from 'react'
import AddPreviewButton from './AddPreviewButton'
import PreviewItem from './PreviewItem'

export default function PreviewList({
    onEdit,
    onDelete,
}: {
    onEdit: () => void
    onDelete: () => void
}): React.ReactElement {
    const [previews, setPreviews] = React.useState([{ title: 'Helloooo' }])

    const addPreview = () => {
        const previewList = [...previews]
        previewList.push({ title: 'Wallah brosjan' })
        setPreviews(previewList)
    }

    return (
        <>
            {previews.map((previews) => (
                <PreviewItem onDelete={onDelete} onEdit={onEdit} id={1} key={Math.random()} title={previews.title}>
                    <></>
                </PreviewItem>
            ))}
            <AddPreviewButton addPreview={addPreview} />
        </>
    )
}
