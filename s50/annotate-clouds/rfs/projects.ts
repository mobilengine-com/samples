//# server program projects for form 'projects'
//# using dacs SendSyncCru;
//# using reftab folder;
//# using reftab project;
//# using reftab settings;
//# using reftab user;
//# using reftab userLcomp;

{
	Log([form]);
	let lcompGuidLocal = db.settings.Read({name: "lcompGuid"}).Single().value;
	let user = db.user.Read({email: form.info.user.name}).Single();
	let userLcomp = db.userLcomp.Read({userGuid: user.guid, lcompGuid: lcompGuidLocal}).Single();
	
	if (userLcomp == null) {
		ThrowError("lcomp not assigned to user" + user + " / "+ lcompGuidLocal);
	}
	if (userLcomp.role != "admin") {
		ThrowError("not enough rights " + userLcomp);
	}
	
	for (let row of form.t.rows) {
		let projectGuid = row.letProjectGuid ?? guid.Generate().ToStringN();
		let lcompGuid = row.letLcompGuid ?? lcompGuidLocal;
		let project = {
			guid: projectGuid,
			lcompGuid: lcompGuid,
			name: row.name.text
		};
		db.project.InsertOrUpdate({guid: projectGuid}, project);
		
		{
			let syncDacs = messages.SendSyncCru.New();

			syncDacs.Packet.guid = project.guid;
			syncDacs.Packet.guidLcomp = project.lcompGuid;
			syncDacs.Packet.guidProject = project.guid;
			syncDacs.Packet.projectNew();
			for ( let key of project.Keys() ) {
				syncDacs.Packet.project[key] = project[key];
			}
			
			syncDacs.Send();		
		}
		
		for (let row2 of row.t2.rows) {
			let folderGuid = row2.letFolderGuid ?? guid.Generate().ToStringN();
			let folder = {
				guid: folderGuid,
				lcompGuid: lcompGuid,
				projectGuid: projectGuid,
				name: row2.name.text
			};
			db.folder.InsertOrUpdate({guid: folderGuid}, folder);
			
			let syncDacs = messages.SendSyncCru.New();

			syncDacs.Packet.guid = folder.guid;
			syncDacs.Packet.guidLcomp = folder.lcompGuid;
			syncDacs.Packet.guidProject = folder.projectGuid;
			syncDacs.Packet.guidFolder = folder.guid;
			syncDacs.Packet.folderNew();
			for ( let key of folder.Keys() ) {
				syncDacs.Packet.folder[key] = folder[key];
			}
			
			syncDacs.Send();		
				
		}
	}
	
}