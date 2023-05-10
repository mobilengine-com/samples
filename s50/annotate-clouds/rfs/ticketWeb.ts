//# server program ticketWeb for form 'ticketsWeb'
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

	let C = form.isNewPoint ? form.ifTicketNew.nbRepeat.number : 1;
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
			db.ticket.Update({
				guid: guidTicket
			}, {
				category: ticketRow.ddCategory.selectedKey,
				section: ticketRow.section.text,
				status: ticketRow.ddStatus.selectedKey,
                description: ticketRow.description.text,
				guidUserAssignee: ticketRow.ddAssignee.selectedKey,
				dueDate: dueDate
			});		
			
			let assignee = db.user.Read({guid: ticketRow.ddAssignee.selectedKey}).Single();

			if (assignee.email!=null) {
				db.ticketAssignment.Insert({
					guidTicket: guidTicket,
					guidUser: assignee.email
				});
			}
			
			let ticket = db.ticket.Read({guid: guidTicket})[0];
						
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
			
			let i=0;
			for(let photo of ticketRow.photo.photos) {
//			var photo = i < ticketRow.photo.photos.length ? ticketRow.photo.photos[i] : 0;
//			if (photo != null) {
				let stI = "_"+(i%C).ToString();
				guidTicketI = guidTicket+stI;
				i=i+1;
				let ticketPhoto = {guidTicket: guidTicketI, mediaidPhoto: fileref.New(photo.photoId, 0)};
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
// 			}				
			}
		}
		
	}
	if (form.ifTicketNew.cond) {
		let mpMediaSent = map.New();
		for (let i=0; i<C; i=i+1) {
			let stI = "_"+i.ToString();

			for (let ticketRow of form.ifTicketNew.ticketsNew.rows) {
				let dueDate = null;
				if (ticketRow.dueDate.date != null) {
					dueDate = ticketRow.dueDate.date.DtlToDtdb();
				}
				let guidTicket = ticketRow.letGuid+stI;
				let userCreator = db.user.Read({email: form.info.user.name }).SingleOrDefault();

				let ticket = {
					guid: guidTicket,
					guidPoint: guidPoint,
					category: ticketRow.ddCategory.selectedKey,
					section: ticketRow.section.text+stI,
					status: ticketRow.ddStatus.selectedKey,
					description: ticketRow.description.text+stI,
					guidUserCreator: userCreator.guid,
					guidUserAssignee: ticketRow.ddAssignee.selectedKey,
					mediaidSignature: null,
					dueDate: dueDate
				};
				db.ticket.Insert(ticket);

				if (ticket.guidUserAssignee!=null) {
					if (ticket.guidUserAssignee != null) {
						db.ticketAssignment.Insert({
							guidTicket: ticket.guid,
							guidUser: ticket.guidUserAssignee
						});
					}
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
					
					let mediaId = ticketPhoto.mediaidPhoto.MediaId();
					if (!mpMediaSent.ContainsKey(mediaId)) {
						let syncMedia = messages.SendSyncMedia.New();
						syncMedia.Media.mediaId = mediaId;
						syncMedia.Media.filename = ticketPhoto.mediaidPhoto.Filename() ?? syncMedia.Media.mediaId+".jpg";
						syncMedia.Media.checksum = ticketPhoto.mediaidPhoto.Checksum();
						syncMedia.Media.size = ticketPhoto.mediaidPhoto.Size();
						syncMedia.Media.guidLcomp = project.lcompGuid;
						syncMedia.Media.guidProject = floorplan.projectGuid;
						syncMedia.Media.guidFolder = floorplan.folderGuid;
						syncMedia.Send();
						mpMediaSent[mediaId]=true;
					}

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
	
}