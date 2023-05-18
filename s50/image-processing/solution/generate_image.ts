//# server typescript program generate_image for form crop_and_draw

//# using reftab images;

{
	Log(form);

	let fr = fileref.New('66f41df6efd3430d93da8664931c8a50', 0);
	let sampleImage = image.FromFileref(fr);

	let cropX = form.crop.x.number;
	let cropY = form.crop.y.number;
	let cropW = form.crop.w.number;
	let cropH = form.crop.h.number;
	sampleImage.Crop(cropX, cropY, cropW, cropH);

	let shapeX = form.ellipse.x.number;
	let shapeY = form.ellipse.y.number;
	let shapeSize = form.ellipse.size.number;
	let shapeColor = form.ellipse.color.text;
	let shapeLineWidth = form.ellipse.lineWidth.number;
	let shapeShape = form.ellipse.shape.selectedKey;
	sampleImage.DrawShape(shapeX, shapeY, shapeSize, {
		color: shapeColor,
		lineWidth: shapeLineWidth,
		shape: shapeShape
	});

	let mediaId = sampleImage.Store("png");
	Log("Stored modified image with mediaId: " + mediaId);

	db.images.Insert({
		mediaId: mediaId,
		description:
			`crop(${cropX},${cropY},${cropW},${cropH})+` +
			`shape(${shapeX},${shapeY},${shapeSize}, ` +
			`{${shapeColor},${shapeLineWidth},${shapeShape}})`,
		generated: dtu.Now().DtuToDtdb()
	});
}