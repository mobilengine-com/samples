//# server typescript program fileManagementScript for form fileManagement

//# using reftab conversions;
//# using reftab matchings;
//# using reftab storeys;

if (form.submitButton === form.processUploads) {
    const now = dtl.Now().DtlToDtdb();

    for (const file of form.uploads.files) {
        const nonConverted = ['.png', '.jpg', '.xkt'];
        const name = file.name.toLowerCase();
        if (nonConverted.find(ext => name.endsWith(ext))) {
            db.conversions.Insert({
                start: now,
                end: now,
                input: file.mediaId,
                output: file.mediaId,
                inputFilename: file.name,
                outputFilename: file.name
            });
        } else if (name.endsWith('.pdf')) {
            const doc = pdf.FromFileref(fileref.New(file.mediaId, 0));
            const pageSize = doc.PageSizes()[0];
            const maxDim = Math.max(pageSize.ptWidth, pageSize.ptHeight);
            const scale = Math.floor(16000 / maxDim);
            const image = doc.Render(0, scale);
            const outputMediaId = image.Store('png');
            const outputFileName = name.substring(0, name.length - 4) + '_page0.png';
            db.conversions.Insert({
                start: now,
                end: now,
                input: file.mediaId,
                output: outputMediaId,
                inputFilename: file.name,
                outputFilename: outputFileName
            });
        } else {
            db.conversions.Insert({start: now, input: file.mediaId, inputFilename: file.name});
            StartTask(new XktConversion(file.mediaId));
        }
    }
}

if (form.submitButton === form.removeSelected) {
    for (const row of form.convTable.rows) {
        if (row.remove.checked) {
            db.conversions.Delete({input: row.input});
            db.matchings.DeleteMany({blueprintId: row.input});
            db.storeys.DeleteMany({modelId: row.input});
        }
    }
}