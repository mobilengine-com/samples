//# server program ReceiveSync for dacs ReceiveSync

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
    Dacsid: "f180cfd0e2744b328e14b7562f4e3adb", 
    Data:
	{
		Sync:
			[
						{
								Cru:
									{
												Packet:
													{
																file: <<null>>, 
																floorplan: <<null>>, 
																folder: <<null>>, 
																guid: "6dde66779fc64088871768813ba69d0e", 
																guidFolder: <<null>>, 
																guidLcomp: <<null>>, 
																guidProject: <<null>>, 
																lcomp: <<null>>, 
																point: <<null>>, 
																project: <<null>>, 
																ticket: <<null>>, 
																ticketPhoto: <<null>>, 
																user:
																	{
																				email:
																					"zoltan.gaspar+sc3@mobilengine.com", 
																					fExternal: 1, 
																				guid:
																					"6dde66779fc64088871768813ba69d0e", 
																					name: "sc3", 
																				status: "invited"
																			}, 
																	userFolder: <<null>>, 
																userLcomp: <<null>>, 
																userProject: <<null>>
															}
												}, 
									hasCru: true, 
								hasDel: false
							}, 
						{
								Cru:
									{
												Packet:
													{
																file: <<null>>, 
																floorplan: <<null>>, 
																folder: <<null>>, 
																guid: "c6493b91e37446778bdc7c0051cad0e9", 
																guidFolder: <<null>>, 
																guidLcomp: <<null>>, 
																guidProject: <<null>>, 
																lcomp: <<null>>, 
																point: <<null>>, 
																project: <<null>>, 
																ticket: <<null>>, 
																ticketPhoto: <<null>>, 
																user:
																	{
																				email:
																					"zoltan.gaspar+sc10@mobilengine.com", 
																					fExternal: 0, 
																				guid:
																					"c6493b91e37446778bdc7c0051cad0e9", 
																					name: "sc10", 
																				status: "invited"
																			}, 
																	userFolder: <<null>>, 
																userLcomp: <<null>>, 
																userProject: <<null>>
															}
												}, 
									hasCru: true, 
								hasDel: false
							}
					]
		}, 
		Dtu: 2021.09.23. 15:35:51 (Dtu), 
	    Meta: "ReceiveSync", 
	    User: <<null>>

}
*/
	for (let sync of dacs.Data.Sync) {
		if (sync.hasDel) {
			let packet = sync.Del.Packet;
			if (packet.kind == "lcomp") {
				db.lcomp.Delete({guid: packet.guid});
			} else if (packet.kind == "project") {
				db.project.Delete({guid: packet.guid});
			} else if (packet.kind == "folder") {
				db.folder.Delete({guid: packet.guid});
			} else if (packet.kind == "file") {
				db.files.Delete({file_guid: packet.guid});
			} else if (packet.kind == "floorplan") {
				db.floorplan.Delete({guid: packet.guid});
			} else if (packet.kind == "point") {
				db.point.Delete({guid: packet.guid});
			} else if (packet.kind == "ticket") {
				db.ticket.Delete({guid: packet.guid});
			} else if (packet.kind == "ticketPhoto") {
				db.ticketPhoto.Delete({guidTicket: packet.guid.SubString(0, packet.guid.IndexOf("/")), mediaidPhoto: packet.guid.SubString(packet.guid.IndexOf("/")+1, packet.guid.Length()-packet.guid.IndexOf("/")-1)});
			} else if (packet.kind == "user") {
				db.user.Delete({guid: packet.guid});
			} else if (packet.kind == "userLcomp") {
				db.userLcomp.Delete({userGuid: packet.guid.SubString(0, packet.guid.IndexOf("/")), lcompGuid: packet.guid.SubString(packet.guid.IndexOf("/")+1, packet.guid.Length()-packet.guid.IndexOf("/")-1)});
			} else if (packet.kind == "userProject") {
				db.userProject.Delete({userGuid: packet.guid.SubString(0, packet.guid.IndexOf("/")), projectGuid: packet.guid.SubString(packet.guid.IndexOf("/")+1, packet.guid.Length()-packet.guid.IndexOf("/")-1)});
			} else if (packet.kind == "userFolder") {
				db.userFolder.Delete({userGuid: packet.guid.SubString(0, packet.guid.IndexOf("/")), folderGuid: packet.guid.SubString(packet.guid.IndexOf("/")+1, packet.guid.Length()-packet.guid.IndexOf("/")-1)});
			}
		}
		else if (sync.hasCru) {
			let packet = sync.Cru.Packet;
			if (packet.lcomp != null) {
				let lcomp = map.New();
				for ( let key of packet.lcomp.Keys() ) {
					lcomp[key] = packet.lcomp[key];
				}
				lcomp["ismaster"]=0;
				db.lcomp.InsertOrUpdate({guid: packet.guid}, lcomp);
			} else if (packet.project != null) {
				let project = map.New();
				for ( let key of packet.project.Keys() ) {
					project[key] = packet.project[key];
				}
				db.project.InsertOrUpdate({guid: packet.guid}, project);
			} else if (packet.folder != null) {
				let folder = map.New();
				for ( let key of packet.folder.Keys() ) {
					folder[key] = packet.folder[key];
				}
				db.folder.InsertOrUpdate({guid: packet.guid}, folder);
			} else if (packet.file != null) {
				let file = map.New();
				for ( let key of packet.file.Keys() ) {
					let val = packet.file[key];
					if (val != null && key == "mediaId") {
						val = fileref.Parse(val);
					}
					else if (TypeOf(val) == "dtl") {
						val = val.DtlToDtdb();
					}
					file[key] = val;
				}
				db.files.InsertOrUpdate({file_guid: packet.guid}, file);
			} else if (packet.floorplan != null) {
				let floorplan = map.New();
				for ( let key of packet.floorplan.Keys() ) {
					let val = packet.floorplan[key];
					floorplan[key] = val;
				}
				db.floorplan.InsertOrUpdate({guid: packet.guid}, floorplan);
			} else if (packet.point != null) {
				let point = map.New();
				for ( let key of packet.point.Keys() ) {
					point[key] = packet.point[key];
				}
				db.point.InsertOrUpdate({guid: packet.guid}, point);
			} else if (packet.ticket != null) {
				let ticket = map.New();
				for ( let key of packet.ticket.Keys() ) {
					let val = packet.ticket[key];
					// TODO: convert fileref
					if (val != null && key == "mediaidSignature") {
						val = fileref.Parse(val);
					}
					else if (TypeOf(val) == "dtl") {
						val = val.DtlToDtdb();
					}
					ticket[key] = val;
				}
				db.ticket.InsertOrUpdate({guid: packet.guid}, ticket);
			} else if (packet.ticketPhoto != null) {
				let ticketPhoto = map.New();
				let mediaidPhoto = null;
				for ( let key of packet.ticketPhoto.Keys() ) {
					let val = packet.ticketPhoto[key];
					if (val != null && key == "mediaidPhoto") {
						val = fileref.Parse(val);
						mediaidPhoto = val;
					}
					ticketPhoto[key] = val;
				}
				db.ticketPhoto.InsertOrUpdate({guidTicket: packet.guid.SubString(0, packet.guid.IndexOf("/")), mediaidPhoto: mediaidPhoto}, ticketPhoto);
			} else if (packet.user != null) {
				let user = map.New();
				for ( let key of packet.user.Keys() ) {
					user[key] = packet.user[key];
				}
				db.user.InsertOrUpdate({guid: packet.guid}, user);
			} else if (packet.userLcomp != null) {
				let userLcomp = map.New();
				for ( let key of packet.userLcomp.Keys() ) {
					userLcomp[key] = packet.userLcomp[key];
				}
				db.userLcomp.InsertOrUpdate({userGuid: packet.guid.SubString(0, packet.guid.IndexOf("/")), lcompGuid: packet.guid.SubString(packet.guid.IndexOf("/")+1, packet.guid.Length()-packet.guid.IndexOf("/")-1)}, userLcomp);
			} else if (packet.userProject != null) {
				let userProject = map.New();
				for ( let key of packet.userProject.Keys() ) {
					userProject[key] = packet.userProject[key];
				}
				db.userProject.InsertOrUpdate({userGuid: packet.guid.SubString(0, packet.guid.IndexOf("/")), projectGuid: packet.guid.SubString(packet.guid.IndexOf("/")+1, packet.guid.Length()-packet.guid.IndexOf("/")-1)}, userProject);
			} else if (packet.userFolder != null) {
				let userFolder = map.New();
				for ( let key of packet.userFolder.Keys() ) {
					userFolder[key] = packet.userFolder[key];
				}
				db.userFolder.InsertOrUpdate({userGuid: packet.guid.SubString(0, packet.guid.IndexOf("/")), folderGuid: packet.guid.SubString(packet.guid.IndexOf("/")+1, packet.guid.Length()-packet.guid.IndexOf("/")-1)}, userFolder);
			}
		}
	}
}