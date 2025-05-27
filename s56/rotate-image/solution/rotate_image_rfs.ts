//# server typescript program rotate_image_rfs for form rotate_image
//# using reftab rotations;

export { };

const f = form as form_rotate_image;
const img = image.FromFileref(fileref.New('66f41df6efd3430d93da8664931c8a50', 0));
img.Rotate(f.image.rotation);
let newMediaId = img.Store('jpg');
db.rotations.Insert({ id: newMediaId, date: dtl.Now().DtlToDtdb() });