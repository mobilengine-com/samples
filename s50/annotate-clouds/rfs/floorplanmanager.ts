﻿//# server program floorplanmanager for form 'floorplanmanager'
//# using reftab floorplan;
//# using reftab project;
//# using dacs SendSyncCru;

{
	let projectGuid = form.ddProject.selectedKey;
	if (projectGuid == null) {
		Log(["no project selected"]);
	} 
	else {
		for (let row of form.t.rows) {
			let guidFloorplan = row.guid ?? guid.Generate().ToStringN();
			let project = db.project.Read({guid: projectGuid})[0];
			let floorplan = {
				guid: guidFloorplan,
				lcompGuid: project.lcompGuid,
				projectGuid: projectGuid,
				name: row.name.text,
				building: row.building.text,
				floor: row.floor.text,
				category: row.cat.selectedKey,
				file_guid: row.file.selectedKey
			};
			db.floorplan.InsertOrUpdate({guid: guidFloorplan}, floorplan);
			let syncDacs = messages.SendSyncCru.New();

//			syncDacs.Packet.kind = "floorplan" ;
			syncDacs.Packet.guid = guidFloorplan;
			syncDacs.Packet.guidLcomp = project.lcompGuid;
			syncDacs.Packet.guidProject = projectGuid;
			syncDacs.Packet.floorplanNew();
			for ( let key of floorplan.Keys() ) {
				syncDacs.Packet.floorplan[key] = floorplan[key];
			}
			
			syncDacs.Send();
		}
	}
	
// trace form;
/*
{
    fs:
        {
            parentControl: <<ref: floorplanmanager>>, 
            selectedKey: "b", 
            selectedText: "simplehtml.pdf", 
            selectedValue:
                {file_guid: "b", file_name: "simplehtml.pdf", file_size: 717629}
        }, 
    fssb:
        {
            parentControl: <<ref: floorplanmanager>>, 
            selectedKey: "New", 
            selectedText: "New", 
            selectedValue: {v: "New"}
        }, 
    info:
        {
            dtlSubmit: 2018.04.12. 16:08:52 (Dtl), 
            dtuSubmit: 2018.04.12. 14:08:52 (Dtu), 
            resultId: 126, 
            user: {lcompId: 100, id: 2, name: "gandalf"}
        }, 
    parentControl: <<null>>, 
    submissionTitle: "floorplans", 
    submitButton: <<null>>, 
    t:
        {
            parentControl: <<ref: floorplanmanager>>, 
            rows:
                [
                    {
                        building:
                            {
                                parentControl:
                                    <<ref: floorplanmanager.t.rows[0]>>, 
                                text: "E"
                            }, 
                        cat:
                            {
                                parentControl:
                                    <<ref: floorplanmanager.t.rows[0]>>, 
                                selectedKey: <<null>>, 
                                selectedText: "<None>", 
                                selectedValue: <<null>>
                            }, 
                        file:
                            {
                                parentControl:
                                    <<ref: floorplanmanager.t.rows[0]>>, 
                                selectedKey: "1385bd2de14b46869d175354ffcf0f55", 
                                selectedText:
                                    "E.02.02 PINCESZINTI ALAPRAJZ_M.pdf", 
                                selectedValue:
                                    {
                                        file_guid:
                                            "1385bd2de14b46869d175354ffcf0f55", 
                                        file_name:
                                            "E.02.02 PINCESZINTI ALAPRAJZ_M.pdf", 
                                        file_size: 2374407
                                    }
                            }, 
                        floor:
                            {
                                parentControl:
                                    <<ref: floorplanmanager.t.rows[0]>>, 
                                text: "P1"
                            }, 
                        guid: "ae7116e7105443829581a9efb43bef70", 
                        name:
                            {
                                parentControl:
                                    <<ref: floorplanmanager.t.rows[0]>>, 
                                text: "E-P1"
                            }, 
                        parentControl: <<ref: floorplanmanager.t>>
                    }, 
                    {
                        building:
                            {
                                parentControl:
                                    <<ref: floorplanmanager.t.rows[1]>>, 
                                text: "E"
                            }, 
                        cat:
                            {
                                parentControl:
                                    <<ref: floorplanmanager.t.rows[1]>>, 
                                selectedKey: <<null>>, 
                                selectedText: "<None>", 
                                selectedValue: <<null>>
                            }, 
                        file:
                            {
                                parentControl:
                                    <<ref: floorplanmanager.t.rows[1]>>, 
                                selectedKey: "6216afb6a66545b6bbbd7f98014c79bc", 
                                selectedText:
                                    "E.02.03 F�LDSZINTI ALAPRAJZ_M.pdf", 
                                selectedValue:
                                    {
                                        file_guid:
                                            "6216afb6a66545b6bbbd7f98014c79bc", 
                                        file_name:
                                            "E.02.03 F�LDSZINTI ALAPRAJZ_M.pdf", 
                                        file_size: 3853065
                                    }
                            }, 
                        floor:
                            {
                                parentControl:
                                    <<ref: floorplanmanager.t.rows[1]>>, 
                                text: "Fsz"
                            }, 
                        guid: "82f0d6b051a748d8ad67331137dac3c7", 
                        name:
                            {
                                parentControl:
                                    <<ref: floorplanmanager.t.rows[1]>>, 
                                text: "E-Fsz"
                            }, 
                        parentControl: <<ref: floorplanmanager.t>>
                    }, 
                    {
                        building:
                            {
                                parentControl:
                                    <<ref: floorplanmanager.t.rows[2]>>, 
                                text: "E"
                            }, 
                        cat:
                            {
                                parentControl:
                                    <<ref: floorplanmanager.t.rows[2]>>, 
                                selectedKey: <<null>>, 
                                selectedText: "<None>", 
                                selectedValue: <<null>>
                            }, 
                        file:
                            {
                                parentControl:
                                    <<ref: floorplanmanager.t.rows[2]>>, 
                                selectedKey: "a51af607aab242c5be79d704c1c92de4", 
                                selectedText:
                                    "E.02.04 ELS� EMELETI ALAPRAJZ_M.pdf", 
                                selectedValue:
                                    {
                                        file_guid:
                                            "a51af607aab242c5be79d704c1c92de4", 
                                        file_name:
                                            "E.02.04 ELS� EMELETI ALAPRAJZ_M.pdf", 
                                        file_size: 2169536
                                    }
                            }, 
                        floor:
                            {
                                parentControl:
                                    <<ref: floorplanmanager.t.rows[2]>>, 
                                text: "1"
                            }, 
                        guid: "80818ba45eeb4974a5bb088801fa6647", 
                        name:
                            {
                                parentControl:
                                    <<ref: floorplanmanager.t.rows[2]>>, 
                                text: "E-1"
                            }, 
                        parentControl: <<ref: floorplanmanager.t>>
                    }, 
                    {
                        building:
                            {
                                parentControl:
                                    <<ref: floorplanmanager.t.rows[3]>>, 
                                text: "y"
                            }, 
                        cat:
                            {
                                parentControl:
                                    <<ref: floorplanmanager.t.rows[3]>>, 
                                selectedKey: "d43ea343927a450783f68d9ad3bf331a", 
                                selectedText: "g�p�szet", 
                                selectedValue:
                                    {
                                        guid: "d43ea343927a450783f68d9ad3bf331a", 
                                        name: "g�p�szet"
                                    }
                            }, 
                        file:
                            {
                                parentControl:
                                    <<ref: floorplanmanager.t.rows[3]>>, 
                                selectedKey: "b", 
                                selectedText: "simplehtml.pdf", 
                                selectedValue:
                                    {
                                        file_guid: "b", 
                                        file_name: "simplehtml.pdf", 
                                        file_size: 717629
                                    }
                            }, 
                        floor:
                            {
                                parentControl:
                                    <<ref: floorplanmanager.t.rows[3]>>, 
                                text: "z"
                            }, 
                        guid: <<null>>, 
                        name:
                            {
                                parentControl:
                                    <<ref: floorplanmanager.t.rows[3]>>, 
                                text: "x0"
                            }, 
                        parentControl: <<ref: floorplanmanager.t>>
                    }
                ]
        }
}
*/	
	
}