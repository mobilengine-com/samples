//# server typescript program startConversion for form convertFiles

//# using reftab conversions;
//# using rfs handleConvRes;

for (let file of form.uploads.files) {
    if (file.name.toLowerCase().endsWith('.pdf')) {
        db.conversions.Insert({ input: file.mediaId });
        const render = new PdfRender(file.mediaId, 0, 2.0, 'jpg');
        StartTask(render, rfs.handleConvRes);
    } else if (file.name.toLowerCase().endsWith('.ifc')) {
        db.conversions.Insert({ input: file.mediaId });
        const xktConvert = new XktConversion(file.mediaId)
        StartTask(xktConvert, rfs.handleConvRes);
    } else {
        throw new Error("Unexpected file name: " + file.name)
    }

}