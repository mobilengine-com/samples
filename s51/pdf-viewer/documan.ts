//# server typescript program documan for form documan
//# using reftab 'rtabFiles';

{
	Log([form]);

	let filupl = form.filupl;
	for (let i = 0; i<filupl.files.Count(); i=i+1) {
		let file = filupl.files[i]; 
		let fileref = filupl.filerefs[i]; 
		db.rtabFiles.Insert({guid: guid.Generate().ToStringN(), filn: file.name, mediaid: fileref.fileref, dirid: null, type: file.type, size: file.size});
	}
}

