//# server typescript program generate_qr_ts for schedule * * * * * first run at 2100-01-01 00:00

//# using reftab qrcodes;

{
	var myQrCode = qrcode.New();
	myQrCode.Text = params.text;
	var mediaId = myQrCode.Generate();
	Log("Generated QR code with mediaId: " + mediaId);
	db.qrcodes.Insert({mediaId: mediaId, text: myQrCode.Text, generated: dtu.Now().DtuToDtdb()});
}