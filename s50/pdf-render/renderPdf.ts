//# server typescript program renderPdf for form pdf_render
//#using reftab images;
{
	let firstUploadedfileMediaId = form.up_load1.files[0].mediaId;
	let pdfileref = fileref.New(firstUploadedfileMediaId, 0);
	let filename = form.up_load1.files[0].name;
	let page = parseInt(form.page.text);
	let width = parseInt(form.width.text);
	let height = parseInt(form.height.text);

	let validPdf = pdf.FromFileref(pdfileref);
	let imagePdf = validPdf.Render(page, width, height);
	let mediaId = imagePdf.Store("png");
	Log("Generate image with mediaId: " + mediaId);
	db.images.Insert({mediaId:mediaId, name: filename.split('.')[0], page: form.page.text, width: form.width.text, height: form.height.text});
}