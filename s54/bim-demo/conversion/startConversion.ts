//# server typescript program startConversion for form convertFiles

//# using reftab conversions;

let now = dtl.Now().DtlToDtdb();

for (let file of form.uploads.files) {
    db.conversions.Insert({ start: now, input: file.mediaId, inputFilename: file.name });
    StartTask(new XktConversion(file.mediaId));
}

for (let file of form.rawUploads.files) {
    db.conversions.Insert({ start: now, end: now, input: file.mediaId, output: file.mediaId, inputFilename: file.name, outputFilename: file.name });
}