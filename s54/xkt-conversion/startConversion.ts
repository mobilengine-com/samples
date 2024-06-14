//# server typescript program startConversion for form convertFiles

//# using reftab conversions;

for (let file of form.uploads.files) {
    db.conversions.Insert({ input: file.mediaId });
    StartTask(new XktConversion(file.mediaId));
}