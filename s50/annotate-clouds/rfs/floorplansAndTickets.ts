//# server program floorplansAndTickets for form 'floorplansAndTickets'
//# using reftab lcomp;
//# using reftab floorplan;
//# using reftab project;
//# using reftab ticket;
//# using reftab point;
//# using reftab user;
//# using reftab ticketStatus;
//# using dacs SendSyncCru;
//# using dacs SendOperation;

{
    Log([form]);
    
    db.ticketStatus.InsertOrUpdate({status: -2}, {status: -2, name: "deleted"});
    db.ticketStatus.InsertOrUpdate({status: -1}, {status: -1, name: "closed"});
    db.ticketStatus.InsertOrUpdate({status: 1}, {status: 1, name: "open"});
    db.ticketStatus.InsertOrUpdate({status: 2}, {status: 2, name: "resolved by subcontractor"});
    db.ticketStatus.InsertOrUpdate({status: 3}, {status: 3, name: "resolved by manager"});

	if (form.submitButton != null && form.submitButton.parentControl["letTicketGuid"] !=null) {
		let ticketGuid = form.submitButton.parentControl.letTicketGuid;
		let lcompGuid = form.submitButton.parentControl.letLcompGuid;
		
		let lcomp = db.lcomp.Read({guid: lcompGuid}).SingleOrDefault();
		let ticket = db.ticket.Read({guid: ticketGuid}).SingleOrDefault();
		let point = db.point.Read({guid: ticket.guidPoint}).SingleOrDefault();
		let floorplan = db.floorplan.Read({guid: point.guidFloorplan}).SingleOrDefault();
        
        if (form.submitButton == form.submitButton.parentControl.btnComment) {
            let comment = form.submitButton.parentControl.comment.text;
            ticket.comments = (ticket.comments != null ? (ticket.comments??"") +"\n" : "") +comment+" ("+form.info.user.name+")";
            
            if (lcomp.ismaster == 1) {
                // update db
                db.ticket.Update({guid: ticketGuid}, ticket);
                // send dacs: packet
                let syncDacs = messages.SendSyncCru.New();
                syncDacs.Packet.guid = ticket.guid;
                syncDacs.Packet.guidLcomp = floorplan.lcompGuid;
                syncDacs.Packet.guidProject = floorplan.projectGuid;
                syncDacs.Packet.guidFolder = floorplan.folderGuid;
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
                
            } else {
                // update db - pending
                ticket.comments = ticket.comments +" - pending";
                db.ticket.Update({guid: ticketGuid}, ticket);
                // send dacs: op
                let syncOp = messages.SendOperation.New();
                syncOp.Operation.guid = guid.Generate().ToStringN();
                syncOp.Operation.guidLcomp = floorplan.lcompGuid;
                syncOp.Operation.guidProject = floorplan.projectGuid;
                syncOp.Operation.ticketCommentNew();
                syncOp.Operation.ticketComment.ticketGuid=ticketGuid;
                syncOp.Operation.ticketComment.comment=comment;
                syncOp.Operation.ticketComment.user=form.info.user.name;
                syncOp.Send();
            }
        }
        else if (form.submitButton == form.submitButton.parentControl.btnEdit) {
            if (lcomp.ismaster == 1) {
            } else {
            }
        }
        else if (form.submitButton == form.submitButton.parentControl.btnDelete) {
            ticket.status = -2;
            db.ticket.Update({guid: ticketGuid}, ticket);
            if (lcomp.ismaster == 1) {
                // send dacs: packet
                let syncDacs = messages.SendSyncCru.New();
                syncDacs.Packet.guid = ticket.guid;
                syncDacs.Packet.guidLcomp = floorplan.lcompGuid;
                syncDacs.Packet.guidProject = floorplan.projectGuid;
                syncDacs.Packet.guidFolder = floorplan.folderGuid;
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

            } else {
                // send dacs: op
                let syncOp = messages.SendOperation.New();
                syncOp.Operation.guid = guid.Generate().ToStringN();
                syncOp.Operation.guidLcomp = floorplan.lcompGuid;
                syncOp.Operation.guidProject = floorplan.projectGuid;
                syncOp.Operation.ticketToStatusNew();
                syncOp.Operation.ticketToStatus.ticketGuid=ticketGuid;
                syncOp.Operation.ticketToStatus.status=ticket.status;
                syncOp.Operation.ticketToStatus.user=form.info.user.name;
                syncOp.Send();
            }
        }
        else if (form.submitButton == form.submitButton.parentControl.btnAssign) {
            let guidUserAssignee = form.submitButton.parentControl.ddAssignee.selectedKey;
            ticket.guidUserAssignee = guidUserAssignee;
            db.ticket.Update({guid: ticketGuid}, ticket);
            if (lcomp.ismaster == 1) {
                // send dacs: packet
                let syncDacs = messages.SendSyncCru.New();
                syncDacs.Packet.guid = ticket.guid;
                syncDacs.Packet.guidLcomp = floorplan.lcompGuid;
                syncDacs.Packet.guidProject = floorplan.projectGuid;
                syncDacs.Packet.guidFolder = floorplan.folderGuid;
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

            } else {
                // send dacs: op
                let syncOp = messages.SendOperation.New();
                syncOp.Operation.guid = guid.Generate().ToStringN();
                syncOp.Operation.guidLcomp = floorplan.lcompGuid;
                syncOp.Operation.guidProject = floorplan.projectGuid;
                syncOp.Operation.ticketAssignNew();
                syncOp.Operation.ticketAssign.ticketGuid=ticketGuid;
                syncOp.Operation.ticketAssign.guidUserAssignee=guidUserAssignee;
                syncOp.Operation.ticketAssign.user=form.info.user.name;
                syncOp.Send();
            }
        }
        else if (form.submitButton == form.submitButton.parentControl.btnForwardResolved) {
            ticket.status = 3;
            db.ticket.Update({guid: ticketGuid}, ticket);
            if (lcomp.ismaster == 1) {
                // send dacs: packet
                let syncDacs = messages.SendSyncCru.New();
                syncDacs.Packet.guid = ticket.guid;
                syncDacs.Packet.guidLcomp = floorplan.lcompGuid;
                syncDacs.Packet.guidProject = floorplan.projectGuid;
                syncDacs.Packet.guidFolder = floorplan.folderGuid;
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

            } else {
                // send dacs: op
                let syncOp = messages.SendOperation.New();
                syncOp.Operation.guid = guid.Generate().ToStringN();
                syncOp.Operation.guidLcomp = floorplan.lcompGuid;
                syncOp.Operation.guidProject = floorplan.projectGuid;
                syncOp.Operation.ticketToStatusNew();
                syncOp.Operation.ticketToStatus.ticketGuid=ticketGuid;
                syncOp.Operation.ticketToStatus.status=ticket.status;
                syncOp.Operation.ticketToStatus.user=form.info.user.name;
                syncOp.Send();
            }
        }
        else if (form.submitButton == form.submitButton.parentControl.btnReject) {
            ticket.status = 1;
            db.ticket.Update({guid: ticketGuid}, ticket);
            if (lcomp.ismaster == 1) {
                // send dacs: packet
                let syncDacs = messages.SendSyncCru.New();
                syncDacs.Packet.guid = ticket.guid;
                syncDacs.Packet.guidLcomp = floorplan.lcompGuid;
                syncDacs.Packet.guidProject = floorplan.projectGuid;
                syncDacs.Packet.guidFolder = floorplan.folderGuid;
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

            } else {
                // send dacs: op
                let syncOp = messages.SendOperation.New();
                syncOp.Operation.guid = guid.Generate().ToStringN();
                syncOp.Operation.guidLcomp = floorplan.lcompGuid;
                syncOp.Operation.guidProject = floorplan.projectGuid;
                syncOp.Operation.ticketToStatusNew();
                syncOp.Operation.ticketToStatus.ticketGuid=ticketGuid;
                syncOp.Operation.ticketToStatus.status=ticket.status;
                syncOp.Operation.ticketToStatus.user=form.info.user.name;
                syncOp.Send();
            }
        }
        else if (form.submitButton == form.submitButton.parentControl.btnAccept) {
            ticket.status = -1;
            db.ticket.Update({guid: ticketGuid}, ticket);
            if (lcomp.ismaster == 1) {
                // send dacs: packet
                let syncDacs = messages.SendSyncCru.New();
                syncDacs.Packet.guid = ticket.guid;
                syncDacs.Packet.guidLcomp = floorplan.lcompGuid;
                syncDacs.Packet.guidProject = floorplan.projectGuid;
                syncDacs.Packet.guidFolder = floorplan.folderGuid;
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

            } else {
                // send dacs: op
                let syncOp = messages.SendOperation.New();
                syncOp.Operation.guid = guid.Generate().ToStringN();
                syncOp.Operation.guidLcomp = floorplan.lcompGuid;
                syncOp.Operation.guidProject = floorplan.projectGuid;
                syncOp.Operation.ticketToStatusNew();
                syncOp.Operation.ticketToStatus.ticketGuid=ticketGuid;
                syncOp.Operation.ticketToStatus.status=ticket.status;
                syncOp.Operation.ticketToStatus.user=form.info.user.name;
                syncOp.Send();
            }
        }
        else if (form.submitButton == form.submitButton.parentControl.btnRejectController) {
            ticket.status = 1;
            db.ticket.Update({guid: ticketGuid}, ticket);
            if (lcomp.ismaster == 1) {
                // send dacs: packet
                let syncDacs = messages.SendSyncCru.New();
                syncDacs.Packet.guid = ticket.guid;
                syncDacs.Packet.guidLcomp = floorplan.lcompGuid;
                syncDacs.Packet.guidProject = floorplan.projectGuid;
                syncDacs.Packet.guidFolder = floorplan.folderGuid;
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

            } else {
                // send dacs: op
                let syncOp = messages.SendOperation.New();
                syncOp.Operation.guid = guid.Generate().ToStringN();
                syncOp.Operation.guidLcomp = floorplan.lcompGuid;
                syncOp.Operation.guidProject = floorplan.projectGuid;
                syncOp.Operation.ticketToStatusNew();
                syncOp.Operation.ticketToStatus.ticketGuid=ticketGuid;
                syncOp.Operation.ticketToStatus.status=ticket.status;
                syncOp.Operation.ticketToStatus.user=form.info.user.name;
                syncOp.Send();
            }
        }
        else if (form.submitButton == form.submitButton.parentControl.btnMarkAsResolved) {
            ticket.status = 2;
            db.ticket.Update({guid: ticketGuid}, ticket);
            if (lcomp.ismaster == 1) {
                // send dacs: packet
                let syncDacs = messages.SendSyncCru.New();
                syncDacs.Packet.guid = ticket.guid;
                syncDacs.Packet.guidLcomp = floorplan.lcompGuid;
                syncDacs.Packet.guidProject = floorplan.projectGuid;
                syncDacs.Packet.guidFolder = floorplan.folderGuid;
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

            } else {
                // send dacs: op
                let syncOp = messages.SendOperation.New();
                syncOp.Operation.guid = guid.Generate().ToStringN();
                syncOp.Operation.guidLcomp = floorplan.lcompGuid;
                syncOp.Operation.guidProject = floorplan.projectGuid;
                syncOp.Operation.ticketToStatusNew();
                syncOp.Operation.ticketToStatus.ticketGuid=ticketGuid;
                syncOp.Operation.ticketToStatus.status=ticket.status;
                syncOp.Operation.ticketToStatus.user=form.info.user.name;
                syncOp.Send();
            }
        }
    }
}