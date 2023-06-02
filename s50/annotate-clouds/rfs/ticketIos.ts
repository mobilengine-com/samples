//# server program ticketIos for form 'ticketsIos'
//# using dacs SendSyncCru;
//# using dacs SendSyncMedia;
//# using reftab project;
//# using reftab floorplan;
//# using reftab point;
//# using reftab ticket;
//# using reftab ticketAssignment;
//# using reftab ticketPhoto;
//# using reftab user;

{
	Log([form]);
	
	let guidPoint = form.ifTicketNew.pointId;

	let point = null;
	let floorplan = null;
	let project = null;

	// create point
	if (form.isNewPoint) {
		point = {
			guid: guidPoint,
			guidFloorplan:	form.letFp.guid,
			ipage: form.ifTicketNew.letPageIndex,
			pctX: form.ifTicketNew.letXFraction,
			pctY: form.ifTicketNew.letYFraction,
			shape: form.ifTicketNew.letShape,
			ptdscr: form.ifTicketNew.letPtdscr
		};
		db.point.Insert(point);
		
		floorplan = db.floorplan.Read({guid: point.guidFloorplan})[0];
		project = db.project.Read({guid: floorplan.projectGuid})[0];
			
		let syncDacs = messages.SendSyncCru.New();

		syncDacs.Packet.guid = point.guid;
		syncDacs.Packet.guidLcomp = project.lcompGuid;
		syncDacs.Packet.guidProject = floorplan.projectGuid;
		syncDacs.Packet.pointNew();
		for ( let key of point.Keys() ) {
			syncDacs.Packet.point[key] = point[key];
		}
		syncDacs.Send();
		
	} else {
		point = db.point.Read({	guid: guidPoint	})[0];
		floorplan = db.floorplan.Read({guid: point.guidFloorplan})[0];
		project = db.project.Read({guid: floorplan.projectGuid})[0];
	}
	
	// update tickets
	if (form.ifTicketSel.cond) {
		for (let ticketRow of form.ifTicketSel.ticketsOld.rows) {

			let guidTicket = ticketRow.letGuid;
			let dueDate = null;
			if (ticketRow.dueDate.date != null) {
				dueDate = ticketRow.dueDate.date.DtlToDtdb();
			}
            let mediaidSignature = ticketRow.signature.binaryId;
            let filerefSignature = null;

			if (mediaidSignature == null) {
                mediaidSignature = ticketRow.letMediaidSignatureOld;
            }
            if (mediaidSignature != null) {
                filerefSignature = fileref.New(mediaidSignature, 0);
            }
			db.ticket.Update({
				guid: guidTicket
			}, {
				category: ticketRow.ddCategory.selectedKey,
				section: ticketRow.section.text,
				status: ticketRow.ddStatus.selectedKey,
                description: ticketRow.description.text,
				guidUserAssignee: ticketRow.ddAssignee.selectedKey,
				mediaidSignature: filerefSignature,
				dueDate: dueDate
			});		
			
			let ticket = db.ticket.Read({guid: guidTicket})[0];
			if (ticket.mediaidSignature != null) {
				let syncMedia = messages.SendSyncMedia.New();
				syncMedia.Media.mediaId = ticket.mediaidSignature.MediaId();
				syncMedia.Media.filename = ticket.mediaidSignature.Filename() ?? syncMedia.Media.mediaId+".jpg";
				syncMedia.Media.checksum = ticket.mediaidSignature.Checksum();
				syncMedia.Media.size = ticket.mediaidSignature.Size();
				syncMedia.Media.guidLcomp = project.lcompGuid;
				syncMedia.Media.guidProject = floorplan.projectGuid;
				syncMedia.Media.guidFolder = floorplan.folderGuid;
				syncMedia.Send();
			}
						
			let syncDacs = messages.SendSyncCru.New();
			syncDacs.Packet.guid = ticket.guid;
			syncDacs.Packet.guidLcomp = project.lcompGuid;
			syncDacs.Packet.guidProject = floorplan.projectGuid;
			syncDacs.Packet.ticketNew();
			for ( let key of ticket.Keys() ) {
                let val = ticket[key];
                if (TypeOf(val) == "fileref") {
                    val = val.ToString();
                }
				if (TypeOf(val) == "dtdb") {
					val = val.DeclareAsDtl();
				}
				syncDacs.Packet.ticket[key] = val;
			}
			syncDacs.Send();
			
			for(let photo of ticketRow.photo.photos) {
				let ticketPhoto = {guidTicket: guidTicket, mediaidPhoto: fileref.New(photo.photoId, 0)};
				db.ticketPhoto.Insert(ticketPhoto);

				let syncMedia = messages.SendSyncMedia.New();
				syncMedia.Media.mediaId = ticketPhoto.mediaidPhoto.MediaId();
                syncMedia.Media.filename = ticketPhoto.mediaidPhoto.Filename() ?? syncMedia.Media.mediaId+".jpg";
                syncMedia.Media.checksum = ticketPhoto.mediaidPhoto.Checksum();
                syncMedia.Media.size = ticketPhoto.mediaidPhoto.Size();
				syncMedia.Media.guidLcomp = project.lcompGuid;
				syncMedia.Media.guidProject = floorplan.projectGuid;
				syncMedia.Media.guidFolder = floorplan.folderGuid;
				syncMedia.Send();

				let syncDacs = messages.SendSyncCru.New();

				syncDacs.Packet.guid = ticketPhoto.guidTicket+"/"+ticketPhoto.mediaidPhoto.MediaId();
				syncDacs.Packet.guidLcomp = project.lcompGuid;
				syncDacs.Packet.guidProject = floorplan.projectGuid;
				syncDacs.Packet.guidFolder = floorplan.folderGuid;
				syncDacs.Packet.ticketPhotoNew();
				for ( let key of ticketPhoto.Keys() ) {
                    let val = ticketPhoto[key];
                    if (TypeOf(val) == "fileref") {
                        val = val.ToString();
                    }
					syncDacs.Packet.ticketPhoto[key] = val;
				}
				syncDacs.Send();
				
			}
		}
		
	}
	if (form.ifTicketNew.cond) {
		for (let ticketRow of form.ifTicketNew.ticketsNew.rows) {
			let dueDate = null;
			if (ticketRow.dueDate.date != null) {
				dueDate = ticketRow.dueDate.date.DtlToDtdb();
			}
			let mediaidSignature = ticketRow.signature.binaryId;
            let guidTicket = ticketRow.letGuid;
            let userCreator = db.user.Read({email: form.info.user.name }).SingleOrDefault();

            let filerefSignature = null;
            if (mediaidSignature != null) {
                filerefSignature = fileref.New(mediaidSignature, 0);
            }
			let ticket = {
				guid: guidTicket,
				guidPoint: guidPoint,
				category: ticketRow.ddCategory.selectedKey,
				section: ticketRow.section.text,
				status: ticketRow.ddStatus.selectedKey,
				description: ticketRow.description.text,
                guidUserCreator: userCreator.guid,
				guidUserAssignee: ticketRow.ddAssignee.selectedKey,
				mediaidSignature: filerefSignature,
				dueDate: dueDate
			};
			db.ticket.Insert(ticket);

			if (ticketRow.ddAssignee.selectedKey != null) {
				let assignee = db.user.Read({guid: ticketRow.ddAssignee.selectedKey}).Single();

				if (assignee.email!=null) {
					db.ticketAssignment.Insert({
						guidTicket: guidTicket,
						guidUser: assignee.email
					});
				}
			}

			if (ticket.mediaidSignature != null) {
				let syncMedia = messages.SendSyncMedia.New();
				syncMedia.Media.mediaId = ticket.mediaidSignature.MediaId();
				syncMedia.Media.filename = ticket.mediaidSignature.Filename() ?? syncMedia.Media.mediaId+".jpg";
				syncMedia.Media.checksum = ticket.mediaidSignature.Checksum();
				syncMedia.Media.size = ticket.mediaidSignature.Size();
				syncMedia.Media.guidLcomp = project.lcompGuid;
				syncMedia.Media.guidProject = floorplan.projectGuid;
				syncMedia.Media.guidFolder = floorplan.folderGuid;
				syncMedia.Send();
			}
			
			let syncDacs = messages.SendSyncCru.New();

			syncDacs.Packet.guid = ticket.guid;
			syncDacs.Packet.guidLcomp = project.lcompGuid;
			syncDacs.Packet.guidProject = floorplan.projectGuid;
			syncDacs.Packet.ticketNew();
			for ( let key of ticket.Keys() ) {
                let val = ticket[key];
                if (TypeOf(val) == "fileref") {
                    val = val.ToString();
                }
				if (TypeOf(val) == "dtdb") {
					val = val.DeclareAsDtl();
				}
				syncDacs.Packet.ticket[key] = val;
			}
			syncDacs.Send();

			for(let photo of ticketRow.photo.photos) {
				let ticketPhoto = {guidTicket: guidTicket, mediaidPhoto: fileref.New(photo.photoId, 0)};
				db.ticketPhoto.Insert(ticketPhoto);
				
				let syncMedia = messages.SendSyncMedia.New();
				syncMedia.Media.mediaId = ticketPhoto.mediaidPhoto.MediaId();
                syncMedia.Media.filename = ticketPhoto.mediaidPhoto.Filename() ?? syncMedia.Media.mediaId+".jpg";
                syncMedia.Media.checksum = ticketPhoto.mediaidPhoto.Checksum();
                syncMedia.Media.size = ticketPhoto.mediaidPhoto.Size();
				syncMedia.Media.guidLcomp = project.lcompGuid;
				syncMedia.Media.guidProject = floorplan.projectGuid;
				syncMedia.Media.guidFolder = floorplan.folderGuid;
				syncMedia.Send();

				let syncDacs = messages.SendSyncCru.New();

				syncDacs.Packet.guid = ticketPhoto.guidTicket+"/"+ticketPhoto.mediaidPhoto.MediaId();
				syncDacs.Packet.guidLcomp = project.lcompGuid;
				syncDacs.Packet.guidProject = floorplan.projectGuid;
				syncDacs.Packet.guidFolder = floorplan.folderGuid;
				syncDacs.Packet.ticketPhotoNew();
				for ( let key of ticketPhoto.Keys() ) {
                    let val = ticketPhoto[key];
                    if (TypeOf(val) == "fileref") {
                        val = val.ToString();
                    }
					syncDacs.Packet.ticketPhoto[key] = val;
				}
				syncDacs.Send();
				
			}
		}
	}
	
}