//# server program ReceiveSyncCru for dacs ReceiveSyncCru

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

{
	Log([dacs]);
/*
{ 
    Dacsid: "702ca93186e5400a827e1681b3a2eead", 
    Dtu: 2019.02.28. 13:59:42 (Dtu), 
    Meta: "ReceiveSyncCru", 
    Packet:
        {
            floorplan: <<null>>, 
            guid: "f64ceb1ddc4b4886bbb9cdf6dd73f953", 
            guidLcomp: "abcd123456789", 
            guidProject: "6648621e95ea4572a6122563e0e2405c", 
            kind: "point", 
            point:
                {
                    guid: "f64ceb1ddc4b4886bbb9cdf6dd73f953", 
                    guidFloorplan: "25a7f025f6bd4618a680621d250731b1", 
                    ipage: 0, 
                    pctX: 0.546296298503876, 
                    pctY: 0.482152670621872
                }, 
            project: <<null>>, 
            ticket: <<null>>, 
            ticketPhoto: <<null>>, 
            user: <<null>>, 
            userProject: <<null>>
        }
}
*/
	
	if (dacs.Packet.lcomp != null) {
		let lcomp = map.New();
		for ( let key of dacs.Packet.lcomp.Keys() ) {
			lcomp[key] = dacs.Packet.lcomp[key];
		}
		lcomp["ismaster"]=0;
		db.lcomp.InsertOrUpdate({guid: dacs.Packet.guid}, lcomp);
	} else if (dacs.Packet.project != null) {
		let project = map.New();
		for ( let key of dacs.Packet.project.Keys() ) {
			project[key] = dacs.Packet.project[key];
		}
		db.project.InsertOrUpdate({guid: dacs.Packet.guid}, project);
	} else if (dacs.Packet.folder != null) {
		let folder = map.New();
		for ( let key of dacs.Packet.folder.Keys() ) {
			folder[key] = dacs.Packet.folder[key];
		}
		db.folder.InsertOrUpdate({guid: dacs.Packet.guid}, folder);
	} else if (dacs.Packet.file != null) {
		let file = map.New();
		for ( let key of dacs.Packet.file.Keys() ) {
			let val = dacs.Packet.file[key];
			if (val != null && key == "mediaId") {
				val = fileref.Parse(val);
			}
			else if (TypeOf(val) == "dtl") {
				val = val.DtlToDtdb();
			}
			file[key] = val;
		}
		db.files.InsertOrUpdate({file_guid: dacs.Packet.guid}, file);
	} else if (dacs.Packet.floorplan != null) {
		let floorplan = map.New();
		for ( let key of dacs.Packet.floorplan.Keys() ) {
			let val = dacs.Packet.floorplan[key];
			floorplan[key] = val;
		}
		db.floorplan.InsertOrUpdate({guid: dacs.Packet.guid}, floorplan);
	} else if (dacs.Packet.point != null) {
		let point = map.New();
		for ( let key of dacs.Packet.point.Keys() ) {
			point[key] = dacs.Packet.point[key];
		}
		db.point.InsertOrUpdate({guid: dacs.Packet.guid}, point);
	} else if (dacs.Packet.ticket != null) {
		let ticket = map.New();
		for ( let key of dacs.Packet.ticket.Keys() ) {
			let val = dacs.Packet.ticket[key];
			// TODO: convert fileref
			if (val != null && key == "mediaidSignature") {
				val = fileref.Parse(val);
			}
			else if (TypeOf(val) == "dtl") {
				val = val.DtlToDtdb();
			}
			ticket[key] = val;
		}
		db.ticket.InsertOrUpdate({guid: dacs.Packet.guid}, ticket);
	} else if (dacs.Packet.ticketPhoto != null) {
		let ticketPhoto = map.New();
		let mediaidPhoto = null;
		for ( let key of dacs.Packet.ticketPhoto.Keys() ) {
			let val = dacs.Packet.ticketPhoto[key];
			if (val != null && key == "mediaidPhoto") {
				val = fileref.Parse(val);
				mediaidPhoto = val;
			}
			ticketPhoto[key] = val;
		}
		db.ticketPhoto.InsertOrUpdate({guidTicket: dacs.Packet.guid.SubString(0, dacs.Packet.guid.IndexOf("/")), mediaidPhoto: mediaidPhoto}, ticketPhoto);
	} else if (dacs.Packet.user != null) {
		let user = map.New();
		for ( let key of dacs.Packet.user.Keys() ) {
			user[key] = dacs.Packet.user[key];
		}
		db.user.InsertOrUpdate({guid: dacs.Packet.guid}, user);
	} else if (dacs.Packet.userLcomp != null) {
		let userLcomp = map.New();
		for ( let key of dacs.Packet.userLcomp.Keys() ) {
			userLcomp[key] = dacs.Packet.userLcomp[key];
		}
		db.userLcomp.InsertOrUpdate({userGuid: dacs.Packet.guid.SubString(0, dacs.Packet.guid.IndexOf("/")), lcompGuid: dacs.Packet.guid.SubString(dacs.Packet.guid.IndexOf("/")+1, dacs.Packet.guid.Length()-dacs.Packet.guid.IndexOf("/")-1)}, userLcomp);
	} else if (dacs.Packet.userProject != null) {
		let userProject = map.New();
		for ( let key of dacs.Packet.userProject.Keys() ) {
			userProject[key] = dacs.Packet.userProject[key];
		}
		db.userProject.InsertOrUpdate({userGuid: dacs.Packet.guid.SubString(0, dacs.Packet.guid.IndexOf("/")), projectGuid: dacs.Packet.guid.SubString(dacs.Packet.guid.IndexOf("/")+1, dacs.Packet.guid.Length()-dacs.Packet.guid.IndexOf("/")-1)}, userProject);
	} else if (dacs.Packet.userFolder != null) {
		let userFolder = map.New();
		for ( let key of dacs.Packet.userFolder.Keys() ) {
			userFolder[key] = dacs.Packet.userFolder[key];
		}
		db.userFolder.InsertOrUpdate({userGuid: dacs.Packet.guid.SubString(0, dacs.Packet.guid.IndexOf("/")), folderGuid: dacs.Packet.guid.SubString(dacs.Packet.guid.IndexOf("/")+1, dacs.Packet.guid.Length()-dacs.Packet.guid.IndexOf("/")-1)}, userFolder);
	}

}