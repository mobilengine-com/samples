//# server program ticket2 for form 'ticket2'
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
	if (form.controlSubmit.nid == "btnSaveAndDone" || form.controlSubmit.nid == "btnSaveAndAgain") {
		//form.root.par...
		//ticketPanel.ticket...
		
		let ticketPanel = form.root.ticket;
		let point = null;
		let floorplan = null;
		let project = null;
		
		let guidPoint = form.root.ticket.par.guidPoint.value;
		if (guidPoint==null || guidPoint == "") {
			guidPoint = guid.Generate().ToStringN();

			point = {
				guid: guidPoint,
				guidFloorplan:	form.root.par.guidFloorplan.value,
				ipage: int.Parse(form.root.ticket.new_point_page.value),
				pctX: float.Parse(form.root.ticket.new_point_x.value),
				pctY: float.Parse(form.root.ticket.new_point_y.value),
				shape: form.root.ticket.new_point_shape.value,
				ptdscr: form.root.ticket.new_point_ptdscr.value
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
			point = db.point.Read( {guid: guidPoint})[0];			
			floorplan = db.floorplan.Read({guid: point.guidFloorplan})[0];
			project = db.project.Read({guid: floorplan.projectGuid})[0];
		}
		
		for (let ticketRow of ticketPanel.ticketNew) {
			let dueDate = null;
			if (ticketRow.dueDate.value!="") {
				dueDate = dtl.Parse( dtf.Parse(" yyyy\"-\"MM\"-\"dd"), 
					ticketRow.dueDate.value
				).DtlToDtdb();
			}
			let guidTicket = guid.Generate().ToStringN();
            let mediaidSignature = null;
            let filerefSignature = null;
			if (ticketRow.signature.SingleOrDefault()!=null) {
                mediaidSignature = ticketRow.signature.SingleOrDefault().value.mediaid;
                filerefSignature = fileref.New(mediaidSignature, 0);
			}
			let ticket = {
				guid: guidTicket,
				guidPoint: guidPoint,
				category: ticketRow.category.key,
				section: ticketRow.section.value,
				status: int.Parse(ticketRow.statusKey.value),
				description: ticketRow.description.value,
				guidUserAssignee: ticketRow.assigneeKey.value,
				guidUserCreator: ticketRow.guidUserCreator.value,
				mediaidSignature: filerefSignature,
				dueDate: dueDate
			};
			db.ticket.Insert(ticket);

			let assignee = db.user.Read({guid: ticketRow.assigneeKey.value}).SingleOrDefault();

			if (assignee != null) {
				db.ticketAssignment.Insert({
					guidTicket: guidTicket,
					guidUser: assignee.email
				});
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
		
			for(let photo of ticketRow.ticketPhoto) {
				let ticketPhoto = {guidTicket: guidTicket, mediaidPhoto: fileref.New(photo.value.mediaid, 0)};
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
		
		for (let ticketRow of ticketPanel.ticketOld) {
			let dueDate = null;
			if (ticketRow.dueDate.value!="") {
				dueDate = dtl.Parse( dtf.Parse(" yyyy\"-\"MM\"-\"dd"), 
					ticketRow.dueDate.value
				).DtlToDtdb();
			}
			let guidTicket = ticketRow.guid.value;
			let mediaidSignature = null;
			if (ticketRow.signature.SingleOrDefault()!=null) {
				mediaidSignature = ticketRow.signature.SingleOrDefault().value.mediaid;
			}
			
			db.ticket.Update({guid: guidTicket}, {
				guid: guidTicket,
				category: ticketRow.category.key,
				section: ticketRow.section.value,
				status: int.Parse(ticketRow.statusKey.value),
				description: ticketRow.description.value,
				guidUserAssignee: ticketRow.assigneeKey.value,
				mediaidSignature: mediaidSignature,
				dueDate: dueDate
			});	
			
			let ticket = db.ticket.Read({guid: guidTicket})[0];
			
			let syncDacs = messages.SendSyncCru.New();
			syncDacs.Packet.guid = ticket.guid;
			syncDacs.Packet.guidLcomp = project.lcompGuid;
			syncDacs.Packet.guidProject = floorplan.projectGuid;
			syncDacs.Packet.ticketNew();
			for ( let key of ticket.Keys() ) {
				let val = ticket[key];
				if (TypeOf(val) == "dtdb") {
					val = val.DeclareAsDtl();
				}
				syncDacs.Packet.ticket[key] = val;
			}
			syncDacs.Send();
			
			for(let photo of ticketRow.ticketPhoto) {
				db.ticketPhoto.Insert({guidTicket: guidTicket, mediaidPhoto: photo.value.mediaid});
				// TODO: sync photos
			}
		}
		
	}
}