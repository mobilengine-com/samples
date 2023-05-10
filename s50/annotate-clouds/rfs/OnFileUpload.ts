//# server program OnFileUpload for form UploadFile
//# using dacs SendSyncCru;
//# using dacs SendSyncMedia;
//# using reftab files;
//# using reftab settings;

{
	Log([systemInfo]);
	let LastIndexOf = function(str, char) {
		for(let i = str.Length() - 1; i >= 0; i = i - 1) {
			if (str.GetAt(i) == char) {
				return i;
			}
		}
		return -1;
	};

	let GetExtension = function(fileName) {
		let len =  fileName.Length();
		let lastDotIndex = LastIndexOf(fileName, ".");
		if (lastDotIndex == -1 || lastDotIndex == len - 1) {
			return "";
		} else {
			return fileName.SubString(lastDotIndex + 1, len - lastDotIndex - 1);
		}
	};

	let lcompGuidLocal = db.settings.Read({name: "lcompGuid"})[0].value;

	for (let i=0; i<form.fileupload.filerefs.Count(); i=i+1) {
		let fr = form.fileupload.filerefs[i];
		let file = form.fileupload.files[i];
		let f = {
			lcompGuid: lcompGuidLocal,
			projectGuid: null,
			folderGuid: null,
			usr: null,
			file_guid: guid.Generate().ToStringN(),
			file_name: file.name,
			file_display_name: file.name,
			file_ext: GetExtension(file.name),
			file_size: file.size,
			file_hash: fr.fileref.Checksum(),
			mediaId: fr.fileref
		};

		if (f.mediaId != null) {
			let syncMedia = messages.SendSyncMedia.New();
			syncMedia.Media.mediaId = f.mediaId.MediaId();
			syncMedia.Media.filename = file.name;
			syncMedia.Media.checksum = f.mediaId.Checksum();
			syncMedia.Media.size = file.size;
			syncMedia.Media.guidLcomp = f.lcompGuid;
			syncMedia.Media.guidProject = f.projectGuid;
			syncMedia.Media.guidFolder = f.folderGuid;
			syncMedia.Send();
		}
		
		let syncDacs = messages.SendSyncCru.New();

		syncDacs.Packet.guid = f.file_guid;
		syncDacs.Packet.guidLcomp = f.lcompGuid;
		syncDacs.Packet.guidProject = null; //file.projectGuid;
		syncDacs.Packet.guidFolder = null; //file.folderGuid;
		syncDacs.Packet.fileNew();
		for ( let key of f.Keys() ) {
			let val = f[key];
			if (TypeOf(val) == "dtdb") {
				val = val.DeclareAsDtl();
			} else if (TypeOf(val) == "fileref") {
				val = val.ToString();
			}
			syncDacs.Packet.file[key] = val;
		}
		
		syncDacs.Send();
			
		db.files.Insert(f);
	}
}