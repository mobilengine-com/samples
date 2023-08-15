//# server typescript program annotate_pdf for form annotated_pdf

//# using reftab pdfs;

function DrawShapeWithIcon(pdf, icon, centerX, centerY, size) {
    pdf.AddShapeAnnotation(0, centerX, centerY, size, {
        shape: "disk", color: "#BF360C", icon: icon
    });
}

{
    db.pdfs.DeleteMany(map.New());

    let blank = pdf.FromFileref(fileref.New("2034ce65680b4245b5621162c709659a", 0));
    let icon = image.FromIcon("corrected");

    DrawShapeWithIcon(blank, icon, 50, 50, 10);
    DrawShapeWithIcon(blank, icon, 100, 100, 50);
    DrawShapeWithIcon(blank, icon, 300, 300, 200);

    let mediaId = blank.Store("annotated.pdf");
    db.pdfs.Insert({ pdf: fileref.New(mediaId, 0) });
}