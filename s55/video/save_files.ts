//# server typescript program save_files for form video
//# using reftab files;

import { saveFile } from "./lib";

Log(form);

const isBackoffice = (db.tracking !== undefined)
if (isBackoffice) {
    for (const photo of form.photo1.photos) {
        let mediaid = photo.photoId;
        let date = photo.datetime.DtlToDtdb()
        let isPhoto = photo.type === "photo"
        saveFile(db.files, mediaid, date, isPhoto)
    }
}