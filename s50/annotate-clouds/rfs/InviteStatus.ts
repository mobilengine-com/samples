//# server program InviteStatus for dacs InviteStatus
//# using reftab user;
//# using dacs SendSyncCru;

{
	Log([dacs]);
	let userDacs = dacs.User;
	if (userDacs.InviteGuid != null && userDacs.InviteGuid != userDacs.UserGuid ) {
		// TODO move data from user with guid InviteGuid to UserGuid
	}
    db.user.Update({guid: userDacs.UserGuid}, {status: userDacs.Status}); 

	let user = db.user.Read({guid: userDacs.UserGuid}).Single();
	let syncDacs = messages.SendSyncCru.New();

	syncDacs.Packet.guid = user.guid;
	syncDacs.Packet.guidLcomp = null;
	syncDacs.Packet.guidProject = null;
	syncDacs.Packet.guidFolder = null;
	syncDacs.Packet.userNew();
	for ( let key of user.Keys() ) {
		syncDacs.Packet.user[key] = user[key];
	}
	
	syncDacs.Send();
	// TODO: Server/Mecomp?
}