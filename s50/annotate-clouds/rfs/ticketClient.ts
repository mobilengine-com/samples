//# client program ticketClient for form 'ticket'
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
		
		let ticketPanel = form.root.ticket[0];
		let point = null;
		let floorplan = null;
		let project = null;
		
		let guidPoint = form.root.par.guidPoint.value;
		if (guidPoint==null || guidPoint == "") {
			guidPoint = guid.Generate().ToStringN();

			point = {
				guid: guidPoint,
				guidFloorplan:	form.root.par.guidFloorplan.value,
				ipage: int.Parse(form.root.par.ipage.value),
				pctX: float.Parse(form.root.par.xPct.value),
				pctY: float.Parse(form.root.par.yPct.value)
			};
			db.point.Insert(point);
			
			floorplan = db.floorplan.Read({guid: point.guidFloorplan})[0];
			project = db.project.Read({guid: floorplan.projectGuid})[0];

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
			if (ticketRow.signature.SingleOrDefault()!=null) {
				mediaidSignature = ticketRow.signature.SingleOrDefault().value.mediaid.ToStringN();
			}
			let ticket = {
				guid: guidTicket,
				guidPoint: guidPoint,
				category: ticketRow.categoryKey.value,
				section: ticketRow.section.value,
				status: int.Parse(ticketRow.statusKey.value),
				description: ticketRow.description.value,
				guidUserAssignee: ticketRow.assigneeKey.value,
				guidUserCreator: ticketRow.guidUserCreator.value,
				mediaidSignature: mediaidSignature,
				dueDate: dueDate
			};
			db.ticket.Insert(ticket);
	
			let assignee = db.user.Read({guid: ticketRow.assigneeKey.value}).Single();

			if (assignee.email != null) {
				db.ticketAssignment.Insert({
					guidTicket: guidTicket,
					guidUser: assignee.email
				});
			}

			for(let photo of ticketRow.ticketPhoto) {
				db.ticketPhoto.Insert({guidTicket: guidTicket, mediaidPhoto: photo.value.mediaid.ToStringN()});
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
				mediaidSignature = ticketRow.signature.SingleOrDefault().value.mediaid.ToStringN();
			}

            db.ticket.Update({guid: guidTicket}, {
				guid: guidTicket,
				category: ticketRow.categoryKey.value,
				section: ticketRow.section.value,
				status: int.Parse(ticketRow.statusKey.value),
				description: ticketRow.description.value,
				guidUserAssignee: ticketRow.assigneeKey.value,
				mediaidSignature: mediaidSignature,
				dueDate: dueDate
			});	

			if (ticketRow.assigneeKey.value!=null) {
				db.ticketAssignment.Insert({
					guidTicket: guidTicket,
					guidUser: ticketRow.assigneeKey.value
				});
			}
	
			for(let photo of ticketRow.ticketPhoto) {
				db.ticketPhoto.Insert({guidTicket: guidTicket, mediaidPhoto: photo.value.mediaid.ToStringN()});
			}
		}
		
	}
}