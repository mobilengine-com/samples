//# server program usermanager for form 'usermanager'
//# using reftab user;
//# using reftab project;
//# using reftab userProject;

{
	let projectGuid = form.ddProject.selectedKey;
	if (projectGuid == null) {
		Log(["no project selected"]);
	} 
	else {
		db.userProject.DeleteMany({projectGuid: projectGuid});
		for (let row of form.t.rows) {
			let guidUser = row.userGuid;
			
			let project = db.project.Read({guid: projectGuid})[0];

			db.userProject.Insert({
				userGuid: guidUser,
				lcompGuid: project.lcompGuid,
				projectGuid: projectGuid
			});
		}
	}	
}