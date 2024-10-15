//# server typescript program matchingScript for form matching

//# using reftab matchings;

interface Matching {
    pdfId: string,
    pdfPageIndex: number,
    blueprintId: string,
    modelId: string,
    storeyId: string,
    storeyName: string,
    imagePicks: string,
    modelPicks: string,
    scale: number[],
    rotation: number[],
    position: number[],
    eyeLevel: number,
    eyeLevelSource: string
}

if (form.submitButton === form.saveMatching) {
    const matching = JSON.parse(form.matcher.matching) as Matching;
    const id = guid.Generate().ToStringN();
    const displayName =
        'Model: "' + form.modelDropdown.selectedText +
        '" Storey: "' + matching.storeyName +
        '" Blueprint: "' + form.blueprintDropdown.selectedText +
        '"';

    db.matchings.DeleteMany({
        id: id
    })
    db.matchings.Insert({
        id: id,
        displayName: displayName,
        modelId: form.modelDropdown.selectedKey,
        blueprintId: form.blueprintDropdown.selectedKey,
        matching: form.matcher.matching,
        createDate: dtl.Now().DtlToDtdb()
    });
}

if (form.submitButton === form.removeSelected) {
    for (const row of form.matchTable.rows) {
        if (row.remove.checked) {
            db.matchings.Delete({id: row.id});
        }
    }
}