//# server typescript program fileManagementScript for form fileManagement

//# using reftab pdfs;
//# using reftab models;
//# using reftab blueprints;
//# using reftab matchings;
//# using reftab storeys;

if (form.submitButton === form.processUploads) {
    for (const file of form.uploads.files) {
        if (file.name.toLowerCase().endsWith('.pdf')) {
            const now = dtl.Now().DtlToDtdb();

            db.pdfs.Insert({
                createDate: now,
                mediaId: file.mediaId,
                filename: file.name
            });

            const doc = pdf.FromFileref(fileref.New(file.mediaId, 0));
            for (let page = 0; page < doc.PageCount(); page++) {
                const pageSize = doc.PageSizes()[page];
                const maxDim = Math.max(pageSize.ptWidth, pageSize.ptHeight);
                const scale = Math.floor(16000 / maxDim); // the max size for the blueprint is 16k*16k
                const image = doc.Render(page, scale);
                const outputMediaId = image.Store('png');
                db.blueprints.Insert({
                    createDate: now,
                    pdfMediaId: file.mediaId,
                    pdfPageIndex: page,
                    imageMediaId: outputMediaId
                });
            }
        } else if (file.name.toLowerCase().endsWith('.ifc')) {
            StartTask(new XktConversion(file.mediaId));
        } else {
            ThrowError("Unexpected file name: " + file.name.toLowerCase());
        }
    }
}

if (form.submitButton === form.removeSelected) {
    for (const row of form.modelsTable.rows) {
        if (row.remove.checked) {
            db.matchings.DeleteMany({blueprintId: row.input});
            db.storeys.DeleteMany({modelId: row.input});
        }
    }
    for (const row of form.pdfsTable.rows) {
        if (row.remove.checked) {
            db.pdfs.DeleteMany({mediaId: row.input});
            db.blueprints.DeleteMany({pdfMediaId: row.input});
        }
    }
    for (const row of form.blueprintsTable.rows) {
        if (row.remove.checked) {
            db.blueprints.DeleteMany({imageMediaId: row.input});
        }
    }
}