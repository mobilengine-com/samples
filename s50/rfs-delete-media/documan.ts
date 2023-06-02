//# server typescript program documan for form documan
//# using reftab 'dirs';
//# using reftab 'files';

{
	Log([form]);
   
	for (let dir of form.rgdir.rows) {
		if (dir.dir.fNew) {
			db.dirs.Insert({dirid: dir.dir.dirid, dirn: dir.dir.dirn});
		}
		for (let file of dir.filupl.files) {
			db.files.Insert({filn: file.name, mediaid: file.mediaId, dirid: dir.dir.dirid, type: file.type, size: file.size});
		}
	}

    if (form.submitButton != null && form.submitButton == form.submitButton.parentControl.sbDel) {
        var row = form.submitButton.parentControl;
        fileref.New(row.letMediaId, 0).Delete(true);
        db.files.Delete({mediaid: row.letMediaId});
    }
}

