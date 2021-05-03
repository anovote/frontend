import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

/**
 * Help for scaling found here
 * https://stackoverflow.com/questions/18191893/generate-pdf-from-html-in-div-using-javascript
 *
 * Creates a PDF from the content inside the resultContainerID provided, if it can find the ID
 * in the DOM.
 * The PDF wil be saved with the provided file name.
 * @returns
 */
export async function createResultsPDF({
    filename,
    resultContainerID,
}: {
    filename: string | undefined
    resultContainerID: string
}): Promise<jsPDF | undefined> {
    // Padding in the document
    const padding = 25
    // Width if the PDF document
    const PDFPageWidth = 850

    const PDFUnit = 'pt'

    const PDFOrientation = 'portrait'

    const resultElement = document.body.querySelector(resultContainerID) as HTMLElement
    if (resultElement) {
        // Creates canvas element from HTML
        const canvas = await html2canvas(resultElement)

        // PDF generator, height is equal to canvas height to create one large page
        const pdf = new jsPDF(PDFOrientation, PDFUnit, [PDFPageWidth, canvas.height])

        // Convert canvas to data URL with maximum quality
        const imgData = canvas.toDataURL('image/jpeg', 1)

        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        const imageWidth = canvas.width
        const imageHeight = canvas.height

        // Create scale factor for scaling the image on the PDF page
        let ratio = 1
        if (imageWidth / imageHeight >= pageWidth / pageHeight) {
            ratio = pageWidth / imageWidth
        } else {
            ratio = pageHeight / imageHeight
        }

        // Adds the canvas image to the PDF
        pdf.addImage(
            imgData,
            'JPEG',
            padding,
            padding,
            // Padding * 2 as we have to remove left/top position padding
            imageWidth * ratio - padding * 2,
            imageHeight * ratio - padding * 2,
        )

        return pdf.save(filename)
    }
}
