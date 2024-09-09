//# server typescript program matchingScript for form matching

//# using reftab matchings;

interface Matching {
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
    const matching = JSON.parse(form.matcher.matchData) as Matching;
    const id = `${matching.blueprintId}-${matching.modelId}-${matching.storeyId}`;
    const displayName =
        'Model: "' + form.modelDropdown.selectedText +
        '" Storey: "' + matching.storeyName +
        '" Blueprint: "' + form.blueprintDropdown.selectedText +
        '"';

    db.matchings.DeleteMany({
        id: id
    });

    db.matchings.Insert({
        id: id,
        displayName: displayName,
        modelId: form.modelDropdown.selectedKey,
        blueprintId: form.blueprintDropdown.selectedKey,
        matchData: form.matcher.matchData
    });
}