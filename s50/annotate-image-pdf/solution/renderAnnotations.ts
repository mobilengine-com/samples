//# server typescript program renderAnnotations for form annotatePdf

//# using reftab annotatedFiles;

import * as utils from "./utils";

const newPoint = form.myAnnotator.newPoint;
if (newPoint == null) {
    ThrowError("No new point on form");
}

const pctPoints = JSON.parse(newPoint.ptdscr).points;
const pageIndex = newPoint.pageIndex;
const isPoint = newPoint.shape == "point";
const style = {
    isPoint: isPoint,
    shape: isPoint 
        ? form.style.shape.selectedKey 
        : newPoint.shape,
    lineWidth: form.style.lineWidth.number,
    
    // 12 is the default size used in the floorplan cropper gateway
    size: form.style.size.number,

    color: form.style.color.text
};

const doc = pdf.FromFileref(form.myAnnotator.fileref);

// make an annotated image with the full page
const fullPageImageMediaId = (() => {
    const image = doc.Render(pageIndex, 1);
    utils.drawAnnotation(image, pctPoints, style);
    const mediaId = image.Store("jpg");
    image.Close();
    return mediaId;
})();

// floorplan-cropper style smaller image
const croppedImageMediaId = (() => {
    const imageSizePx = 700;
    const polygonSizePx = 600;

    // render with the correct scale
    let scale = 3;
    if (!isPoint) {
        const ptPoints = doc.AnnotatorToPdfCoordinates(pageIndex, pctPoints);
        const boundingRectPt = utils.boundingRect(ptPoints);
        scale = polygonSizePx / Math.max(boundingRectPt.width, boundingRectPt.height);
    }
    const image = doc.Render(pageIndex, scale);

    // draw the annotation
    utils.drawAnnotation(image, pctPoints, style);

    // crop the image
    const pxPoints = utils.annotatorToImageCoordinates(image, pctPoints);
    const boundingRectPx = utils.boundingRect(pxPoints);
    const cropRectPx = utils.addPadding(boundingRectPx, imageSizePx, imageSizePx);
    cropRectPx.width = Math.min(cropRectPx.width, image.Width - cropRectPx.x);
    cropRectPx.height = Math.min(cropRectPx.height, image.Height - cropRectPx.y);
    image.Crop(cropRectPx.x, cropRectPx.y, cropRectPx.width, cropRectPx.height);

    const mediaId = image.Store("jpg");
    image.Close();
    return mediaId;
})();

// make the annotated pdf
const pdfMediaId = (() => {
    const ptPoints = doc.AnnotatorToPdfCoordinates(pageIndex, pctPoints);
    if (isPoint) {
        doc.AddShapeAnnotation(pageIndex, ptPoints[0].x, ptPoints[0].y, style.size, style);
    } else {
        doc.AddPolygonAnnotation(pageIndex, ptPoints, style);
    }
    return doc.Store("document.pdf");
})();

doc.Close();

// store the new files for the showAnnotatedFiles form
db.annotatedFiles.Insert({
    id: guid.Generate().ToStringN(),
    creationDate: dtl.Now().DtlToDtdb(),
    pdfMediaId: pdfMediaId,
    fullPageImageMediaId: fullPageImageMediaId,
    croppedImageMediaId: croppedImageMediaId
});