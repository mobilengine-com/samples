//# server program ReceiveOperation for dacs ReceiveOperation

//# using reftab lcomp;
//# using reftab project;
//# using reftab folder;
//# using reftab floorplan;
//# using reftab point;
//# using reftab ticket;
//# using reftab ticketPhoto;
//# using reftab user;
//# using reftab userLcomp;
//# using reftab userProject;
//# using reftab userFolder;
//# using dacs SendSyncCru;


{
	Log([dacs]);
	if (dacs.Operation.ticketComment != null) {
		let ticketGuid = dacs.Operation.ticketComment.ticketGuid;
		let comment = dacs.Operation.ticketComment.comment;
		let user = dacs.Operation.ticketComment.user;
		let ticket = db.ticket.Read({guid: ticketGuid}).SingleOrDefault();
		if (ticket != null) {
			ticket.comments = (ticket.comments != null ? (ticket.comments??"") +"\n" : "") +"\n" +comment+" ("+user+")";
			db.ticket.Update({guid: ticketGuid}, ticket);
			// send dacs: packet
			let syncDacs = messages.SendSyncCru.New();
			syncDacs.Packet.guid = ticket.guid;
			syncDacs.Packet.guidLcomp = dacs.Operation.guidLcomp;
			syncDacs.Packet.guidProject = dacs.Operation.guidProject;
			syncDacs.Packet.guidFolder = dacs.Operation.guidFolder;
			syncDacs.Packet.ticketNew();
			for ( let key of ticket.Keys() ) {
				let val = ticket[key];
				if (TypeOf(val) == "dtdb") {
					val = val.DeclareAsDtl();
				} else if (TypeOf(val) == "fileref") {
					val = val.ToString();
				}
				syncDacs.Packet.ticket[key] = val;
			}
			syncDacs.Send();
		}
	}
	else if (dacs.Operation.ticketAssign != null) {
		let ticketGuid = dacs.Operation.ticketAssign.ticketGuid;
		let guidUserAssignee = dacs.Operation.ticketAssign.guidUserAssignee;
		let user = dacs.Operation.ticketAssign.user;
		let ticket = db.ticket.Read({guid: ticketGuid}).SingleOrDefault();
		if (ticket != null) {
			ticket.guidUserAssignee = guidUserAssignee;
			db.ticket.Update({guid: ticketGuid}, ticket);
			// send dacs: packet
			let syncDacs = messages.SendSyncCru.New();
			syncDacs.Packet.guid = ticket.guid;
			syncDacs.Packet.guidLcomp = dacs.Operation.guidLcomp;
			syncDacs.Packet.guidProject = dacs.Operation.guidProject;
			syncDacs.Packet.guidFolder = dacs.Operation.guidFolder;
			syncDacs.Packet.ticketNew();
			for ( let key of ticket.Keys() ) {
				let val = ticket[key];
				if (TypeOf(val) == "dtdb") {
					val = val.DeclareAsDtl();
				} else if (TypeOf(val) == "fileref") {
					val = val.ToString();
				}
				syncDacs.Packet.ticket[key] = val;
			}
			syncDacs.Send();
		}
	}
	else if (dacs.Operation.ticketToStatus != null) {
		let ticketGuid = dacs.Operation.ticketToStatus.ticketGuid;
		let status = dacs.Operation.ticketToStatus.status;
		let user = dacs.Operation.ticketToStatus.user;
		let ticket = db.ticket.Read({guid: ticketGuid}).SingleOrDefault();
		if (ticket != null) {
			ticket.status = status;
			db.ticket.Update({guid: ticketGuid}, ticket);
			// send dacs: packet
			let syncDacs = messages.SendSyncCru.New();
			syncDacs.Packet.guid = ticket.guid;
			syncDacs.Packet.guidLcomp = dacs.Operation.guidLcomp;
			syncDacs.Packet.guidProject = dacs.Operation.guidProject;
			syncDacs.Packet.guidFolder = dacs.Operation.guidFolder;
			syncDacs.Packet.ticketNew();
			for ( let key of ticket.Keys() ) {
				let val = ticket[key];
				if (TypeOf(val) == "dtdb") {
					val = val.DeclareAsDtl();
				} else if (TypeOf(val) == "fileref") {
					val = val.ToString();
				}
				syncDacs.Packet.ticket[key] = val;
			}
			syncDacs.Send();
		}
	}

}