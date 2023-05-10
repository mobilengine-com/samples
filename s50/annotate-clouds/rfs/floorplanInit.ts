//# server program floorplanInit for schedule * * * * * first run at 2200-01-01 10:00

//# using reftab lcomp;
//# using reftab project;
//# using reftab folder;
//# using reftab files;
//# using reftab floorplan;
//# using reftab point;
//# using reftab ticket;
//# using reftab ticketPhoto;
//# using reftab user;
//# using reftab userLcomp;
//# using reftab userProject;
//# using reftab userFolder;

//# using dacs SendSync;

{
	let cMsgSend = 100;
	let cMsg = -1;
	let syncDacs = null;
	let packet = null;
	let media = null;
	let sendDacs = function() {
		if (cMsg>-1) {
			syncDacs.Send();
		}
		cMsg = -1;
	};
	let addCruSend = function() {
		if (cMsg==cMsgSend) {
			sendDacs();
		}
		if (cMsg==-1) {
			syncDacs = messages.SendSync.New();
			cMsg = 0;
		}
		let sync = syncDacs.Data.Sync.AddNew();
		packet = sync.CruNew().Packet;
		cMsg = cMsg+1;
	};
	let fSendMedia = true;
	let addMediaSend = function() {
		if (cMsg==cMsgSend) {
			sendDacs();
		}
		if (cMsg==-1) {
			syncDacs = messages.SendSync.New();
			cMsg = 0;
		}
		let sync = syncDacs.Data.Sync.AddNew();
		media = sync.MediaNew().Media;
		cMsg = cMsg+1;
	};

	for ( let lcomp of db.lcomp.Read({ismaster: 1}) ) {
		addCruSend();
		packet.guid = lcomp.guid;
		packet.guidLcomp = lcomp.guid;
		packet.lcompNew();
		for ( let key of lcomp.Keys() ) {
			if (key != "ismaster") {
				packet.lcomp[key] = lcomp[key];
			}
		}
	}		
	for ( let project of db.project.Read(map.New()) ) {
		let comp = db.lcomp.Read({ismaster: 1, guid: project.lcompGuid}).SingleOrDefault();
		if (comp != null) {
			addCruSend();

			packet.guid = project.guid;
			packet.guidLcomp = project.lcompGuid;
			packet.guidProject = project.guid;
			packet.projectNew();
			for ( let key of project.Keys() ) {
				packet.project[key] = project[key];
			}
		}
	}	
	for ( let folder of db.folder.Read(map.New()) ) {
		let comp = db.lcomp.Read({ismaster: 1, guid: folder.lcompGuid}).SingleOrDefault();
		if (comp != null) {
			addCruSend();

			packet.guid = folder.guid;
			packet.guidLcomp = folder.lcompGuid;
			packet.guidProject = folder.projectGuid;
			packet.folderNew();
			for ( let key of folder.Keys() ) {
				packet.folder[key] = folder[key];
			}
		}
	}	
	for ( let floorplan of db.floorplan.Read(map.New()) ) {
		let comp = db.lcomp.Read({ismaster: 1, guid: floorplan.lcompGuid}).SingleOrDefault();
		if (comp != null) {
			addCruSend();

			packet.guid = floorplan.guid;
			packet.guidLcomp = floorplan.lcompGuid;
			packet.guidProject = floorplan.projectGuid;
			packet.guidFolder = floorplan.folderGuid;
			packet.floorplanNew();
			for ( let key of floorplan.Keys() ) {
				packet.floorplan[key] = floorplan[key];
			}
		}
	}	
	for ( let file of db.files.Read(map.New()) ) {
		let comp = db.lcomp.Read({ismaster: 1, guid: file.lcompGuid}).SingleOrDefault();
		if (comp != null) {

			if (fSendMedia && file.mediaId != null) {
				addMediaSend();
				media.mediaId = file.mediaId.MediaId();
				media.filename = file.mediaId.Filename() ?? "file.xxx";
				media.checksum = file.mediaId.Checksum();
				media.size = file.mediaId.Size();
				media.guidLcomp = file.lcompGuid;
				media.guidProject = file.projectGuid;
				media.guidFolder = file.folderGuid;
			}
			
			addCruSend();
			packet.guid = file.file_guid;
			packet.guidLcomp = file.lcompGuid;
			packet.guidProject = file.projectGuid;
			packet.guidFolder = file.folderGuid;
			packet.fileNew();
			for ( let key of file.Keys() ) {
				let val = file[key];
				if (TypeOf(val) == "dtdb") {
					val = val.DeclareAsDtl();
				} else if (TypeOf(val) == "fileref") {
					val = val.ToString();
				}
				packet.file[key] = val;
			}
		}
	}
	for ( let point of db.point.Read(map.New()) ) {
		let floorplan = db.floorplan.Read({guid: point.guidFloorplan}).Single();
		let project = db.project.Read({guid: floorplan.projectGuid}).Single();
		let comp = db.lcomp.Read({ismaster: 1, guid: project.lcompGuid}).SingleOrDefault();
		if (comp != null) {

			addCruSend();

			packet.guid = point.guid;
			packet.guidLcomp = project.lcompGuid;
			packet.guidProject = floorplan.projectGuid;
			packet.guidFolder = floorplan.folderGuid;
			packet.pointNew();
			for ( let key of point.Keys() ) {
				packet.point[key] = point[key];
			}
		}
	}
	for ( let ticket of db.ticket.Read(map.New()) ) {
		let point = db.point.Read({guid: ticket.guidPoint}).Single();		
		let floorplan = db.floorplan.Read({guid: point.guidFloorplan}).Single();
		let project = db.project.Read({guid: floorplan.projectGuid}).Single();
		let comp = db.lcomp.Read({ismaster: 1, guid: project.lcompGuid}).SingleOrDefault();
		if (comp != null) {
			if (fSendMedia && ticket.mediaidSignature != null) {
				addMediaSend();
				media.mediaId = ticket.mediaidSignature.MediaId();
				media.filename = ticket.mediaidSignature.Filename() ?? media.mediaId+".jpg";
				media.checksum = ticket.mediaidSignature.Checksum();
				media.size = ticket.mediaidSignature.Size();
				media.guidLcomp = project.lcompGuid;
				media.guidProject = floorplan.projectGuid;
				media.guidFolder = floorplan.folderGuid;
			}

			addCruSend();

			packet.guid = ticket.guid;
			packet.guidLcomp = project.lcompGuid;
			packet.guidProject = floorplan.projectGuid;
			packet.guidFolder = floorplan.folderGuid;
			packet.ticketNew();
			for ( let key of ticket.Keys() ) {
				let val = ticket[key];
				if (TypeOf(val) == "dtdb") {
					val = val.DeclareAsDtl();
				} else if (TypeOf(val) == "fileref") {
					val = val.ToString();
				}
				packet.ticket[key] = val;
			}
		}
	}
	for ( let ticketPhoto of db.ticketPhoto.Read(map.New()) ) {
		let ticket = db.ticket.Read({guid: ticketPhoto.guidTicket}).Single();		
		let point = db.point.Read({guid: ticket.guidPoint}).Single();		
		let floorplan = db.floorplan.Read({guid: point.guidFloorplan}).Single();
		let project = db.project.Read({guid: floorplan.projectGuid}).Single();
		
		if (fSendMedia) {
			addMediaSend();

			media.mediaId = ticketPhoto.mediaidPhoto.MediaId();
			media.filename = ticketPhoto.mediaidPhoto.Filename() ?? media.mediaId+".jpg";
			media.checksum = ticketPhoto.mediaidPhoto.Checksum();
			media.size = ticketPhoto.mediaidPhoto.Size();
			media.guidLcomp = project.lcompGuid;
			media.guidProject = floorplan.projectGuid;
			media.guidFolder = floorplan.folderGuid;
		}

		addCruSend();

		packet.guid = ticketPhoto.guidTicket+"/"+ticketPhoto.mediaidPhoto.MediaId();
		packet.guidLcomp = project.lcompGuid;
		packet.guidProject = floorplan.projectGuid;
		packet.guidFolder = floorplan.folderGuid;
		packet.ticketPhotoNew();

		for ( let key of ticketPhoto.Keys() ) {
			let val = ticketPhoto[key];
			if (TypeOf(val) == "fileref") {
				val = val.ToString();
			}
			packet.ticketPhoto[key] = val;
		}
	}	
	
	for ( let user of db.user.Read(map.New()) ) {
		addCruSend();

		packet.guid = user.guid;
		packet.guidLcomp = null;
		packet.guidProject = null;
		packet.guidFolder = null;
		packet.userNew();
		for ( let key of user.Keys() ) {
			packet.user[key] = user[key];
		}
	}	
	for ( let userLcomp of db.userLcomp.Read(map.New()) ) {
		let comp = db.lcomp.Read({ismaster: 1, guid: userLcomp.lcompGuid}).SingleOrDefault();
		if (comp != null) {
			addCruSend();

			packet.guid = userLcomp.userGuid+"/"+userLcomp.lcompGuid;
			packet.guidLcomp = userLcomp.lcompGuid;
			packet.guidProject = null;
			packet.userLcompNew();
			for ( let key of userLcomp.Keys() ) {
				packet.userLcomp[key] = userLcomp[key];
			}
		}
	}	
	for ( let userProject of db.userProject.Read(map.New()) ) {
		let comp = db.lcomp.Read({ismaster: 1, guid: userProject.lcompGuid}).SingleOrDefault();
		if (comp != null) {
			addCruSend();

			packet.guid = userProject.userGuid+"/"+userProject.projectGuid;
			packet.guidLcomp = userProject.lcompGuid;
			packet.guidProject = userProject.projectGuid;
			packet.userProjectNew();
			for ( let key of userProject.Keys() ) {
				packet.userProject[key] = userProject[key];
			}
		}
	}	
	for ( let userFolder of db.userFolder.Read(map.New()) ) {
		let comp = db.lcomp.Read({ismaster: 1, guid: userFolder.lcompGuid}).SingleOrDefault();
		if (comp != null) {

			addCruSend();

			packet.guid = userFolder.userGuid+"/"+userFolder.folderGuid;
			packet.guidLcomp = userFolder.lcompGuid;
			packet.guidProject = userFolder.projectGuid;
			packet.guidFolder = userFolder.folderGuid;
			packet.userFolderNew();
			for ( let key of userFolder.Keys() ) {
				packet.userFolder[key] = userFolder[key];
			}
		}
	}	

	sendDacs();
}
