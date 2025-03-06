export function saveFile(table, mediaid, date, isPhoto) {
    const shareFileName = isPhoto
        ? "photo-" + mediaid + ".jpg"
        : "video-" + mediaid + ".mp4"
    table.Insert({
        mediaid: mediaid,
        date: date,
        link: CreateDownloadLink([{
            fileref: mediaid,
            name: shareFileName
        }], "forever", "unlimited", null)
    });
}