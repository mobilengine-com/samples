﻿//# server program floorplanDelAll for schedule * * * * * first run at 2200-01-01 10:00

//# using reftab floorplan;
//# using reftab project;
//# using dacs SendSyncDel;


{
	for ( let floorplan of db.floorplan.Read(map.New()) ) {
		let project = db.project.Read({guid: floorplan.projectGuid})[0];
		let syncDacs = messages.SendSyncDel.New();

		syncDacs.Packet.kind = "floorplan" ;
		syncDacs.Packet.guid = floorplan.guid;
		syncDacs.Packet.guidLcomp = project.lcompGuid;
		syncDacs.Packet.guidProject = floorplan.projectGuid;
		
		syncDacs.Send();
	}
}
