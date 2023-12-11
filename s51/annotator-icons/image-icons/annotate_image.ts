//# server typescript program annotate_image for form annotated_image

//# using reftab images;

function DrawShapeWithIcon(canvas, icon, centerX, centerY, size) {
    canvas.DrawShape(centerX, centerY, size, {
        shape: "disk", color: "#BF360C"
    });

    let resizedIcon = icon.Clone();
    resizedIcon.Resize(size, size);
    canvas.DrawImage(resizedIcon, centerX - size / 2, centerY - size / 2);
    resizedIcon.Close();
}

{
    db.images.DeleteMany(map.New());

    let canvas = image.FromIcon("blank");
    let icon = image.FromIcon("corrected");

    DrawShapeWithIcon(canvas, icon, 50, 50, 10);
    DrawShapeWithIcon(canvas, icon, 100, 100, 50);
    DrawShapeWithIcon(canvas, icon, 300, 300, 200);

    let mediaId = canvas.Store("png");
    db.images.Insert({ image: fileref.New(mediaId, 0) });
}