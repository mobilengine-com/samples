﻿//# server program ReceiveSyncDel for dacs ReceiveSyncDel

//# using reftab lcomp;
//# using reftab project;
//# using reftab folder;
//# using reftab floorplan;
//# using reftab files;
//# using reftab point;
//# using reftab ticket;
//# using reftab ticketPhoto;
//# using reftab user;
//# using reftab userLcomp;
//# using reftab userProject;
//# using reftab userFolder;


{
	Log([dacs]);
	
	if (dacs.Packet.kind == "lcomp") {
		db.lcomp.Delete({guid: dacs.Packet.guid});
	} else if (dacs.Packet.kind == "project") {
		db.project.Delete({guid: dacs.Packet.guid});
	} else if (dacs.Packet.kind == "folder") {
		db.folder.Delete({guid: dacs.Packet.guid});
	} else if (dacs.Packet.kind == "file") {
		db.files.Delete({file_guid: dacs.Packet.guid});
	} else if (dacs.Packet.kind == "floorplan") {
		db.floorplan.Delete({guid: dacs.Packet.guid});
	} else if (dacs.Packet.kind == "point") {
		db.point.Delete({guid: dacs.Packet.guid});
	} else if (dacs.Packet.kind == "ticket") {
		db.ticket.Delete({guid: dacs.Packet.guid});
	} else if (dacs.Packet.kind == "ticketPhoto") {
		db.ticketPhoto.Delete({guidTicket: dacs.Packet.guid.SubString(0, dacs.Packet.guid.IndexOf("/")), mediaidPhoto: dacs.Packet.guid.SubString(dacs.Packet.guid.IndexOf("/")+1, dacs.Packet.guid.Length()-dacs.Packet.guid.IndexOf("/")-1)});
	} else if (dacs.Packet.kind == "user") {
		db.user.Delete({guid: dacs.Packet.guid});
	} else if (dacs.Packet.kind == "userLcomp") {
		db.userLcomp.Delete({userGuid: dacs.Packet.guid.SubString(0, dacs.Packet.guid.IndexOf("/")), lcompGuid: dacs.Packet.guid.SubString(dacs.Packet.guid.IndexOf("/")+1, dacs.Packet.guid.Length()-dacs.Packet.guid.IndexOf("/")-1)});
	} else if (dacs.Packet.kind == "userProject") {
		db.userProject.Delete({userGuid: dacs.Packet.guid.SubString(0, dacs.Packet.guid.IndexOf("/")), projectGuid: dacs.Packet.guid.SubString(dacs.Packet.guid.IndexOf("/")+1, dacs.Packet.guid.Length()-dacs.Packet.guid.IndexOf("/")-1)});
	} else if (dacs.Packet.kind == "userFolder") {
		db.userFolder.Delete({userGuid: dacs.Packet.guid.SubString(0, dacs.Packet.guid.IndexOf("/")), folderGuid: dacs.Packet.guid.SubString(dacs.Packet.guid.IndexOf("/")+1, dacs.Packet.guid.Length()-dacs.Packet.guid.IndexOf("/")-1)});
	}

}