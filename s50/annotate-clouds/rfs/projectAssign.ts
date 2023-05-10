//# server program projectAssign for form 'projectAssign'
//# using reftab user;
//# using reftab userLcomp;
//# using reftab project;
//# using reftab userProject;
//# using reftab settings;
//# using dacs InviteExternal;
//# using dacs SendSyncCru;
//# using dacs SendSyncDel;

{
/**} ---> System.Exception: reference to undefined member 'letUserGuid' on object
 * {
    ddRole:
        {
            parentControl: <<ref: projectAssign.t.rows[0]>>, 
            selectedKey: "subcontractor", 
            selectedText: "subcontractor", 
            selectedValue: {v: ...}
        }, 
    ddUser:
        {
            parentControl: <<ref: projectAssign.t.rows[0]>>, 
            selectedKey: <<null>>, 
            selectedText: <<null>>, 
            selectedValue: <<null>>
        }, 
    letRole: <<null>>, 
    letUser: <<null>>, 
    name: {parentControl: <<ref: projectAssign.t.rows[0]>>, text: "GZ Alma"}, 
    parentControl: <<ref: projectAssign.t>>, 
    status: {parentControl: <<ref: projectAssign.t.rows[0]>>, text: <<null>>}, 
    tbEmail:
        {
            parentControl: <<ref: projectAssign.t.rows[0]>>, 
            text: "zoltan.gaspar+alma@mobilengine.com"
        }, 
    tvEmail: {parentControl: <<ref: projectAssign.t.rows[0]>>, text: <<null>>}
}
 */
	Log([form]);

	let lcompGuidLocal = db.settings.Read({name: "lcompGuid"})[0].value;
	
	let lcompGuid = form.letLcomp != null ? form.letLcomp.guid : lcompGuidLocal;
	let projectGuid = form.letProject.guid;
	for (let row of form.t.rows) {
		let guidRow = null;
		let user = null;
		if (row.letUser == null) {
			// new user, create
			guidRow = guid.Generate().ToStringN();

			let usr = {
				name: row.name.text,
				email: row.tbEmail.text,
				lang: row.ddLang.selectedKey,
				fExternal: 1
			};
			db.user.InsertOrUpdate({guid: guidRow}, usr);
	
			user = db.user.Read({guid: guidRow}).SingleOrDefault();
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

			let inviteDacs = messages.InviteExternal.New();
			inviteDacs.User.InviteGuid = user.guid;
			inviteDacs.User.Name = user.name;
			inviteDacs.User.Lang = user.lang;
			inviteDacs.User.Email = user.email;
			inviteDacs.User.LcompGuid = lcompGuid;
			inviteDacs.User.ProjectGuid = projectGuid;
			inviteDacs.User.HasWebformAccess = "false";
			inviteDacs.User.HasBIAccess = "true";
			let forms = inviteDacs.User.FormsNew();
			forms.Add("floorplans");
//			forms.Add("floorplansAndTickets");

			inviteDacs.Send();
			db.user.Update({guid: guidRow}, {
				status: "invite sent"
			});
		} else {
			guidRow = row.letUser.guid;
			user = db.user.Read({guid: guidRow}).SingleOrDefault();
		}
		// assign (new+existing)
		
		let role = row.ddRole.selectedKey;
		let userProjEx = db.userProject.Read({userGuid: user.guid, projectGuid: projectGuid}).SingleOrDefault();
		if (userProjEx == null || role != userProjEx.role) {
			if (role==null) {
				if ( userProjEx != null ) {
					db.userProject.Delete({userGuid: user.guid, projectGuid: projectGuid});
					let syncDacs = messages.SendSyncDel.New();

					syncDacs.Packet.guid = user.guid+"/"+projectGuid;
					syncDacs.Packet.guidLcomp = lcompGuid;
					syncDacs.Packet.guidProject = projectGuid;
					syncDacs.Packet.guidFolder = null;
					syncDacs.Packet.kind = "userProject";
					
					syncDacs.Send();		
				}
			}
			else {
				let userProj = {userGuid: user.guid, lcompGuid: lcompGuid, projectGuid: projectGuid, role: role};
				db.userProject.InsertOrUpdate({userGuid: user.guid, lcompGuid: lcompGuid, projectGuid: projectGuid}, userProj);
				{
					let syncDacs = messages.SendSyncCru.New();

					syncDacs.Packet.guid = user.guid+"/"+projectGuid;
					syncDacs.Packet.guidLcomp = lcompGuid;
					syncDacs.Packet.guidProject = projectGuid;
					syncDacs.Packet.guidFolder = null;
					syncDacs.Packet.userProjectNew();
					syncDacs.Packet.userProject["userGuid"] = userProj.userGuid;
					syncDacs.Packet.userProject["lcompGuid"] = userProj.lcompGuid;
					syncDacs.Packet.userProject["projectGuid"] = userProj.projectGuid;
					syncDacs.Packet.userProject["role"] = userProj.role;
					
					syncDacs.Send();		
				}
			}
		}
	}
	
}