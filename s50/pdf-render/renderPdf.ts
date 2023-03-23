//# server typescript program renderPdf for form pdf_render
//#using reftab images;
{
	let validPdf = pdf.FromFileref(fileref.New(form.up_load1.files[0].mediaId, 0));
	var filename = form.up_load1.files[0].name;
	var page = parseInt(form.page.text);
	var width = parseInt(form.width.text);
	var height = parseInt(form.height.text);
	var imagePdf = validPdf.Render(page, width, height);
	var mediaId = imagePdf.Store("png");
	Log("Generate image with mediaId: " + mediaId);
	db.images.Insert({mediaId:mediaId, name: filename.split('.')[0], page: form.page.text, width: form.width.text, height: form.height.text});
}