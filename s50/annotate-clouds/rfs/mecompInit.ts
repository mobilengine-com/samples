//# server program mecompInit for schedule * * * * * first run at 2200-01-01 10:00

//# using dacs MecompCapabilities;

{
	let dacs = messages.MecompCapabilities.New();
	dacs.Mecomp.Capabilities.Add("FCapableBlockedSync");
	dacs.Mecomp.Capabilities.Add("FCapableSyncProgress");
	dacs.Mecomp.Capabilities.Add("FAlma");
	dacs.Send();
}
