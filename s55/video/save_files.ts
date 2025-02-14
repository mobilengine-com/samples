//# server typescript program save_files for form video
//# using reftab files;

Log(form);

for (const photo of form.root.photo1.map(p => p.value)) {
    let mediaid = photo.mediaid.ToStringN();
    db.files.Insert({
        mediaid: mediaid,
        date: photo.dtlShoot.DtlToDtdb(),
        link: CreateDownloadLink([{
            fileref: mediaid,
            name: "video-" + mediaid + ".mp4"
        }], "forever", "unlimited", null)
    });
}