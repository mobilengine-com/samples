//# client server typescript program save_files_android_external for form external_video_android
//# using reftab files;

import { saveFile } from "./lib";

Log(form);

const isBackoffice = (db.tracking !== undefined)
if (isBackoffice) {
    for (const photo of form.root.photo1.map(p => p.value)) {
        let mediaid = photo.mediaid.ToStringN();
        let date = photo.dtlShoot.DtlToDtdb()
        let isPhoto = photo.type === "photo"
        saveFile(db.files, mediaid, date, isPhoto)
    }
}