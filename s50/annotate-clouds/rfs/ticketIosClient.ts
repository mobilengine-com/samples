//# client program ticketIosClient for form 'ticketsIos'
//# using reftab floorplan;
//# using reftab point;
//# using reftab ticket;
//# using reftab ticketPhoto;
//# using reftab user;

{
	Log([form]);
	
	let guidPoint = form.ifTicketNew.pointId;
	
	// create point
	if (form.isNewPoint) {
		db.point.Insert({
			guid: guidPoint,
			guidFloorplan:	form.letFp.guid,
			ipage: form.ifTicketNew.letPageIndex,
			pctX: form.ifTicketNew.letXFraction,
			pctY: form.ifTicketNew.letYFraction
		});
		
	}
	
	// update tickets
	if (form.ifTicketSel.cond) {
		for (let ticketRow of form.ifTicketSel.ticketsOld.rows) {

			let guidTicket = ticketRow.letGuid;
			let dueDate = null;
			if (ticketRow.dueDate.date != null) {
				dueDate = ticketRow.dueDate.date.DtlToDtdb();
			}
			/*var mediaidSignature = ticketRow.signature.binaryId;
			if (mediaidSignature == null) {
				mediaidSignature = ticketRow.letMediaidSignatureOld;
			}*/
			db.ticket.Update({
				guid: guidTicket
			}, {
				category: ticketRow.ddCategory.selectedKey,
				section: ticketRow.section.text,
				status: ticketRow.ddStatus.selectedKey,
				description: ticketRow.description.text,
				guidUserAssignee: ticketRow.ddAssignee.selectedKey,
//                mediaidSignature: mediaidSignature,
				dueDate: dueDate
			});		
//			foreach(var photo in ticketRow.photo.photos) {
//				db.ticketPhoto.Insert({guidTicket: guidTicket, mediaidPhoto: photo.photoId});
//			}
		}
		
	}
	if (form.ifTicketNew.cond) {
		for (let ticketRow of form.ifTicketNew.ticketsNew.rows) {
			let dueDate = null;
			if (ticketRow.dueDate.date != null) {
				dueDate = ticketRow.dueDate.date.DtlToDtdb();
			}
//			var mediaidSignature = ticketRow.signature.binaryId;
            let guidTicket = ticketRow.letGuid;
            let userCreator = db.user.Read({email: form.info.user.name }).SingleOrDefault();
            
			db.ticket.Insert({
				guid: guidTicket,
				guidPoint: guidPoint,
				category: ticketRow.ddCategory.selectedKey,
				section: ticketRow.section.text,
				status: ticketRow.ddStatus.selectedKey,
				description: ticketRow.description.text,
                guidUserCreator: userCreator.guid,
				guidUserAssignee: ticketRow.ddAssignee.selectedKey,
//				mediaidSignature: mediaidSignature,
				dueDate: dueDate
			});
//			foreach(var photo in ticketRow.photo.photos) {
//				db.ticketPhoto.Insert({guidTicket: guidTicket, mediaidPhoto: photo.photoId});
//			}
		}
	}

}