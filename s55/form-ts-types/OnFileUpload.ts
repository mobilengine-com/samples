//# server typescript program OnFileUpload for form UploadFile
{
	const tform = form as form_UploadFile;
	let mediaidSignature = tform.sig.binaryId;
	Log(["signature id:", mediaidSignature])

	Log(["submitter:", tform.info.user.name])
	Log(["loc:", tform.info.location])

	let photos = tform.photo.photos;
	for(let photo of photos) {
		Log(["photo id", photo.photoId])
	}

	for (let i=0; i<tform.fileupload.filerefs.Count(); i=i+1) {
		let fr = tform.fileupload.filerefs[i].fileref;
		let file = tform.fileupload.files[i];
		Log(["fileref", fr, fr.MediaId(), fr.Size(), fr.Filename(), fr.Checksum(), fr.Priority(), "file", file, "toString", fr.ToString()])
	}
	Log(form)

}
