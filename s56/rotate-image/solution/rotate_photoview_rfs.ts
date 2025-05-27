//# server typescript program rotate_photoview_rfs for form rotate_photoview
//# using reftab rotations;

export { };

const f = form as form_rotate_photoview;
for (const photo of f.photoview.photos) {
    const img = image.FromFileref(fileref.New(photo.theId, 0));
    img.Rotate(photo.theRotation);
    let newMediaId = img.Store('jpg');
    db.rotations.Insert({ id: newMediaId, date: dtl.Now().DtlToDtdb() });
}