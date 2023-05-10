//# server program users for form 'users'
//# using reftab user;
//# using reftab userLcomp;
//# using reftab userProject;
//# using reftab userFolder;
//# using reftab settings;
//# using dacs InviteExternal;
//# using dacs SendSyncCru;
//# using dacs SendSyncDel;

{
	if (form.submitButton != null && form.submitButton["letUserGuidToDelete"]!=null) {
		let userGuidToDelete = form.submitButton.letUserGuidToDelete;

		let user = db.user.Read({guid: userGuidToDelete}).Single();

		let rguserlcomp = db.userLcomp.Read({userGuid: user.guid});
		for (let userLcomp of rguserlcomp) {
			db.userLComp.Delete(userLcomp);

			let syncDacs = messages.SendSyncDel.New();

			syncDacs.Packet.guid = userLcomp.userGuid+"/"+userLcomp.lcompGuid;
			syncDacs.Packet.guidLcomp = userLcomp.lcompGuid;
			syncDacs.Packet.guidProject = null;
			syncDacs.Packet.guidFolder = null;
			syncDacs.Packet.kind = "userLcomp";
			
			syncDacs.Send();		
	
		}
		let rguserproject = db.userProject.Read({userGuid: user.guid});
		for (let userProject of rguserproject) {
			db.userProject.Delete(userProject);

			let syncDacs = messages.SendSyncDel.New();

			syncDacs.Packet.guid = userProject.userGuid+"/"+userProject.projectGuid;
			syncDacs.Packet.guidLcomp = userProject.lcompGuid;
			syncDacs.Packet.guidProject = userProject.projectGuid;
			syncDacs.Packet.guidFolder = null;
			syncDacs.Packet.kind = "userProject";
			
			syncDacs.Send();		
		}		
		let rguserfolder = db.userFolder.Read({userGuid: user.guid});
		for (let userFolder of rguserfolder) {
			db.userFolder.Delete(userFolder);

			let syncDacs = messages.SendSyncDel.New();

			syncDacs.Packet.guid = userFolder.userGuid+"/"+userFolder.folderGuid;
			syncDacs.Packet.guidLcomp = userFolder.lcompGuid;
			syncDacs.Packet.guidProject = userFolder.projectGuid;
			syncDacs.Packet.guidFolder = userFolder.folderGuid;
			syncDacs.Packet.kind = "userFolder";
			
			syncDacs.Send();		
		}		

		db.user.Delete(user);
		let syncDacs = messages.SendSyncDel.New();

		syncDacs.Packet.guid = user.guid;
		syncDacs.Packet.guidLcomp = null;
		syncDacs.Packet.guidProject = null;
		syncDacs.Packet.guidFolder = null;
		syncDacs.Packet.kind = "user";
		
		syncDacs.Send();		

	} 
	else {
		let lcompGuidLocal = db.settings.Read({name: "lcompGuid"})[0].value;
		
		let lcompGuid = form.letLcomp != null ? form.letLcomp.guid : lcompGuidLocal;
		for (let row of form.t.rows) {
			let guidRow = row.letUserGuid ?? guid.Generate().ToStringN();
			let usr = {
				name: row.name.text,
				email: row.email.text,
				lang: row.ddLang.selectedKey,
				fExternal: (row.fExternal.checked ? 1 : 0)
			};
			db.user.InsertOrUpdate({guid: guidRow}, usr);

			let user = db.user.Read({guid: guidRow})[0];
			{
				let syncDacs = messages.SendSyncCru.New();

				syncDacs.Packet.guid = user.guid;
				syncDacs.Packet.guidLcomp = null; //should be synced everywhere
				syncDacs.Packet.guidProject = null;
				syncDacs.Packet.guidFolder = null;
				syncDacs.Packet.userNew();
				for ( let key of user.Keys() ) {
					syncDacs.Packet.user[key] = user[key];
				}
				
				syncDacs.Send();		
			}
			
			let role = row.ddRole.selectedKey;
			let userCompEx = db.userLcomp.Read({userGuid: guidRow, lcompGuid: lcompGuid}).SingleOrDefault();
			if (role==null) {
				if ( userCompEx != null ) {
					db.userLcomp.Delete({userGuid: guidRow, lcompGuid: lcompGuid});
					let syncDacs = messages.SendSyncDel.New();

					syncDacs.Packet.guid = user.guid+"/"+lcompGuid;
					syncDacs.Packet.guidLcomp = lcompGuid;
					syncDacs.Packet.guidProject = null;
					syncDacs.Packet.guidFolder = null;
					syncDacs.Packet.kind = "userLcomp";
					
					syncDacs.Send();		
				}
			}
			else {
				let userComp = {userGuid: guidRow, lcompGuid: lcompGuid, role: role};
				db.userLcomp.InsertOrUpdate({userGuid: guidRow, lcompGuid: lcompGuid}, userComp);
				{
					let syncDacs = messages.SendSyncCru.New();

					syncDacs.Packet.guid = user.guid+"/"+lcompGuid;
					syncDacs.Packet.guidLcomp = lcompGuid;
					syncDacs.Packet.guidProject = null;
					syncDacs.Packet.guidFolder = null;
					syncDacs.Packet.userLcompNew();
					syncDacs.Packet.userLcomp["userGuid"] = userComp.userGuid;
					syncDacs.Packet.userLcomp["lcompGuid"] = userComp.lcompGuid;
					syncDacs.Packet.userLcomp["role"] = userComp.role;
					
					syncDacs.Send();		
				}
			}
				
			if (row.letUserGuid == null && row.fExternal.checked) {
				let inviteDacs = messages.InviteExternal.New();
				inviteDacs.User.InviteGuid = guidRow;
				inviteDacs.User.Name = usr.name;
				inviteDacs.User.Lang = usr.lang;
				inviteDacs.User.Email = usr.email;
				inviteDacs.User.LcompGuid = lcompGuid;
				inviteDacs.Send();
				db.user.Update({guid: guidRow}, {
					status: "invite sent"
				});
			}
		}
	}	
}