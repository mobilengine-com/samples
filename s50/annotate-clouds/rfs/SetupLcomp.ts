﻿//# server program SetupLcomp for dacs SetupLcomp
//# using reftab user;
//# using reftab lcomp;
//# using reftab settings;

{
	Log([dacs]);
	let lcomp = dacs.Lcomp;

	db.lcomp.Insert({guid: lcomp.Guid, name: lcomp.Name, ismaster: 1});

	/// setting local selected lcomp
	db.settings.InsertOrUpdate({name:"lcompGuid"}, {name:"lcompGuid", value: lcomp.Guid});
}