//# server typescript program matchingScript for form matching

//# using reftab matchings;

if (form.submitButton === form.saveMatching) {
    db.matchings.Insert({
        id: guid.Generate().ToStringN(),
        modelId: form.modelDropdown.selectedKey,
        blueprintId: form.blueprintDropdown.selectedKey,
        matchData: form.matcher.matchData
    });
}