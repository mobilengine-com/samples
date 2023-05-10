﻿//# server program SetupUser for dacs SetupUser
//# using reftab user;
//# using reftab userLcomp;
//# using dacs SendSyncCru;
//# using dacs SendSyncDel;

{
	let userDacs = dacs.User;

	let guidRow = userDacs.Guid;
	let usr = {
		name: userDacs.Name,
		email: userDacs.Email,
		lang: userDacs.Lang,
		fExternal: userDacs.Role == null ? 0 : 1
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

	if (userDacs.Role != null) {
		let role = userDacs.Role;
		let lcompGuid = userDacs.LcompGuid;
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
}


/*
{
	trace dacs;
    Dacsid: "468af9aeb0cb4eb4af45785dbc8ed8de", 
    Dtu: 2019.06.05. 14:42:33 (Dtu), 
    Meta: "SetupUser", 
    User:
        {
            Email: "zoltan.gaspar+adminZZ155@mobilengine.com", 
            Guid: "1463fd2210f040878a7e354f75729200", 
            LcompGuid: "f2bf5cd8ae964a88818c5d616276f8ca", 
            MecompGuid: "66ff1267d669433eb56867b1928f9650", 
            MecompName: "MECOMPnew", 
            Name: "zoltan.gaspar+adminZZ155@mobilengine.com", 
            Role: "admin", 
            ServerGuid: "1", 
            ServerName: "https://devzgaspar.mobilengine.com:4443/services/comex"
        }
}
*/
