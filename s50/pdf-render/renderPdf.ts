//# server typescript program renderPdf for form pdf_render
//#using reftab images;
{
	let firstUploadedfileMediaId = form.up_load1.files[0].mediaId;
	let pdfileref = fileref.New(firstUploadedfileMediaId, 0);
	let filename = form.up_load1.files[0].name;
	let page = parseInt(form.page.text);
	let scale = parseFloat(form.scale.text);

	let validPdf = pdf.FromFileref(pdfileref);
	let imagePdf = validPdf.Render(page, scale);
	let mediaId = imagePdf.Store("png");
	Log("Generate image with mediaId: " + mediaId);
	db.images.Insert({mediaId:mediaId, name: filename.split('.')[0], page: form.page.text, scale: form.scale.text});
}