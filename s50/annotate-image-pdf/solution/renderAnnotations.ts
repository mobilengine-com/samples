//# server typescript program renderAnnotations for form annotatePdf

//# using reftab annotatedFiles;

import * as utils from "./utils";

Log(form);

const newPoint = form.myAnnotator.newPoint;
const pctPoints = JSON.parse(newPoint.ptdscr).points;
const pageIndex = newPoint.pageIndex;
const isPoint = newPoint.shape == "point";
const style = {
    shape: newPoint.shape,
    lineWidth: 2,
    dotSize: 36,
    color: "#FF0000"
};

const doc = pdf.FromFileref(form.myAnnotator.fileref);

// make the annotated image
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

    // render with the correct scale
    let scale = 3;
    if (!isPoint) {
        const ptPoints = doc.AnnotatorToPdfCoordinates(pageIndex, pctPoints);
        const boundingRectPt = utils.boundingRect(ptPoints);
        const shapeSizePx = 600;
        scale = shapeSizePx / Math.max(boundingRectPt.width, boundingRectPt.height);
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
    const pdfStyle = { ...style, dotSize: style.dotSize / 3 };
    if (isPoint) {
        const dot = utils.addPadding(utils.boundingRect(ptPoints), pdfStyle.dotSize, pdfStyle.dotSize);
        Log(["pdf ellipse", dot]);
        doc.AddEllipseAnnotation(pageIndex, pdfStyle.color, dot.x, dot.y, dot.width, dot.height);
    } else {
        doc.AddPolygonAnnotation(pageIndex, ptPoints, pdfStyle);
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