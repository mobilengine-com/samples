//# server client typescript program ios_photo_signature for form ios_photo_signature
{
	const tform = form as form_ios_photo_signature;
	let mediaidSignature = tform.signature.binaryId;
	Log(["signature id:", mediaidSignature])

	Log(["submitter:", tform.info.user.name])
	Log(["loc:", tform.info.location])

	let photos = tform.photo.photos;
	for(let photo of photos) {
		Log(["photo id", photo.photoId])
	}

	Log(form)

}
