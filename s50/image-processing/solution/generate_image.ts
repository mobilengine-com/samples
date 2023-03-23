//# server typescript program generate_image for form crop_and_draw

//# using reftab images;

{
	let fr = fileref.New('43da973f7a3e4f5b84a8f0c432da2401', 0);
	let sampleImage = image.FromFileref(fr);
	
	let cx = form.crop.x.number;
	let cy = form.crop.y.number;
	let cw = form.crop.w.number;
	let ch = form.crop.h.number;
	sampleImage.Crop(cx, cy, cw, ch);

	let ec = form.ellipse.color.text;
	let ex = form.ellipse.x.number;
	let ey = form.ellipse.y.number;
	let ew = form.ellipse.w.number;
	let eh = form.ellipse.h.number;
	sampleImage.FillEllipse(ec, ex, ey, ew, eh);

	let mediaId = sampleImage.Store("jpg");
	Log("Stored modified image with mediaId: " + mediaId);

	db.images.Insert({
		mediaId: mediaId, 
		description: `crop(${cx},${cy},${cw},${ch})+ellipse(${ec},${ex},${ey},${ew},${eh})`, 
		generated: dtu.Now().DtuToDtdb()
	});
}