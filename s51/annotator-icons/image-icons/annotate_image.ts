//# server typescript program annotate_image for form annotated_image

//# using reftab images;

function DrawShapeWithIcon(canvas, image, centerX, centerY, size) {
    canvas.DrawShape(centerX, centerY, size, {
        shape: "disk", color: "#BF360C"
    });

    let resizedImage = image.Clone();
    resizedImage.Resize(size, size);
    canvas.DrawImage(resizedImage, centerX - size / 2, centerY - size / 2);
    resizedImage.Close();
}

{
    db.images.DeleteMany(map.New());

    let blank = image.FromIcon("blank");
    let icon = image.FromIcon("corrected");

    DrawShapeWithIcon(blank, icon, 50, 50, 10);
    DrawShapeWithIcon(blank, icon, 100, 100, 50);
    DrawShapeWithIcon(blank, icon, 300, 300, 200);

    let mediaId = blank.Store("png");
    db.images.Insert({ image: fileref.New(mediaId, 0) });
}