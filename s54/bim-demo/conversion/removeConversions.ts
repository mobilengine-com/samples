//# server typescript program removeConversions for form previousConversions

//# using reftab conversions;

for (const row of form.convTable.rows) {
    if (row.remove.checked) {
        db.conversions.Delete({input: row.input});
    }
}