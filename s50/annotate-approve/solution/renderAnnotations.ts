//# server typescript program renderAnnotations for form annotatePdf

//# using reftab annotatedFiles;

function addApprovedStamp(document: pdf, page: number, text: string, qrcodeText: string, position: "topLeft" | "bottomRight") {
    const cmToPt = (cm: number) => cm / 2.54 * 72;

    const padding = 5;
    const textWidth = cmToPt(3);
    const qrCodeSize = cmToPt(2);
    const fontSize = 8;
    const pageMargin = cmToPt(1);
    const borderWidth = 1;

    var textSize = pdf.MeasureText(text, textWidth, {fontSize: fontSize});
    var stampPosition = {
        x: undefined,
        y: undefined,
        width: textSize.width + qrCodeSize + padding,
        height: Math.max(qrCodeSize, textSize.height + 2 * padding)
    }

    if (position === "topLeft") {
        stampPosition.x = pageMargin;
        stampPosition.y = pageMargin;
    } else {
        const pageSizes = document.PageSizes();
        stampPosition.x = pageSizes[page].ptWidth - stampPosition.width - pageMargin;
        stampPosition.y = pageSizes[page].ptHeight - stampPosition.height - pageMargin;
    }

    pdfDoc.AddFreeTextAnnotation(page, text, stampPosition, {
        borderWidth: borderWidth,
        fontSize: fontSize,
        padding: {
            top: padding,
            right: padding,
            bottom: padding,
            left: qrCodeSize
        }
    });

    const qrGenerator = qrcode.New();
    qrGenerator.Text = qrcodeText;
    const qrcodeImage = qrGenerator.Generate();
    const qrSizeWithPadding = qrCodeSize - 4 * borderWidth;
    pdfDoc.AddImageAnnotation(page, qrcodeImage, {
        x: stampPosition.x + 2 * borderWidth,
        y: stampPosition.y + stampPosition.height / 2 - qrSizeWithPadding / 2,
        width: qrSizeWithPadding,
        height: qrSizeWithPadding
    });

    const bauappLogoMediaId = "0e4505d0927e47bb9cf0431b2af4a684";
    const bauappLogo = image.FromFileref(fileref.New(bauappLogoMediaId, 0));
    const logoWidth = stampPosition.width * 0.4;
    const logoWidthOriginal = 300;
    const logoHeightOriginal = 64;
    const logoHeight = logoWidth * logoHeightOriginal / logoWidthOriginal;
    pdfDoc.AddImageAnnotation(page, bauappLogo, {
        x: stampPosition.x + stampPosition.width / 2 - logoWidth / 2,
        y: stampPosition.y - logoHeight / 2,
        width: logoWidth,
        height: logoHeight
    });
}

const pdfDoc = pdf.FromFileref(fileref.New("73194bbb940ac694d607ee88f16dff10", 0));
addApprovedStamp(pdfDoc, 0, form.annotation.text, form.qrcode.text, form.topleft.checked ? "topLeft" : "bottomRight");
const pdfMediaId = pdfDoc.Store("document.pdf");
db.annotatedFiles.Insert({
    id: guid.Generate().ToStringN(),
    creationDate: dtl.Now().DtlToDtdb(),
    pdfMediaId: pdfMediaId
});