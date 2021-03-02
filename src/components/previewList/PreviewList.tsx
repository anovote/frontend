import * as React from 'react'
import AddPreviewButton from './AddPreviewButton'
import PreviewItem from './PreviewItem'

export default function PreviewList({
    onEdit,
    onDelete,
    onAdd,
    listItems = [],
}: {
    onEdit: () => void
    onAdd: () => void
    onDelete: () => void
    listItems: Array<string>
}): React.ReactElement {
    const [previews, setPreviews] = React.useState([{ title: 'Helloooo' }])

    const addPreview = () => {
        const previewList = [...previews]
        previewList.push({ title: 'Wallah brosjan' })
        setPreviews(previewList)
    }

    return (
        <>
            {previews.map((previews, index) => (
                <PreviewItem
                    onDelete={onDelete}
                    onEdit={onEdit}
                    id={index}
                    key={Math.random()}
                    itemTitle={previews.title}
                ></PreviewItem>
            ))}
            <AddPreviewButton addPreview={onAdd} />
        </>
    )
}
