//# server typescript program xlsxmaker for form xlsxmaker
//# using reftab 'rtabFiles';

{
	Log(form);
	let xlsx = excel.New();
	let sheet = xlsx.AddSheet(form.tbSheet.text);
	let filn = form.tbFilename.text+".xlsx";

	let headerStyle = {font: "Arial", fontHeight: 15, 
	bold: true, italic: true, underlined: true, strikethrough: true,
	fontColor: "Red", backgroundColor: "Blue", 
	alignment: "Center", wrapText: true};

	xlsx.SetValue(sheet, 0, 0, form.t.tbHeaderText.text);
	xlsx.SetStyle(sheet, 0, 0, headerStyle);
	xlsx.SetValue(sheet, 0, 1, form.t.tbHeaderInt.text);
	xlsx.SetStyle(sheet, 0, 1, headerStyle);
	xlsx.SetValue(sheet, 0, 2, form.t.tbHeaderFloat.text);
	xlsx.SetStyle(sheet, 0, 2, headerStyle);
	xlsx.SetValue(sheet, 0, 3, form.t.tbHeaderDate.text);
	xlsx.SetStyle(sheet, 0, 3, headerStyle);
	xlsx.SetValue(sheet, 0, 4, form.t.tbHeaderBool.text);
	xlsx.SetStyle(sheet, 0, 4, headerStyle);
	xlsx.SetValue(sheet, 0, 5, form.t.tbHeaderBool.text);
	xlsx.SetStyle(sheet, 0, 5, headerStyle);
	xlsx.SetValue(sheet, 0, 6, form.t.tbHeaderBool.text);
	xlsx.SetStyle(sheet, 0, 6, headerStyle);
	xlsx.SetValue(sheet, 0, 7, form.t.tbHeaderBool.text);
	xlsx.SetStyle(sheet, 0, 7, headerStyle);

	let iRow=1;
	for (let row of form.t.rows) {
		xlsx.SetValue(sheet, iRow, 0, row.tbText.text);
		xlsx.SetValue(sheet, iRow, 1, row.nbInt.number);
		xlsx.SetValue(sheet, iRow, 2, row.nbFloat.number);
		xlsx.SetValue(sheet, iRow, 3, row.dpDate.date?.DtlToDtdb());
		xlsx.SetStyle(sheet, iRow, 3, {format: "yyyy-mm-dd"});
		xlsx.SetValue(sheet, iRow, 4, row.cbBool.checked);	
		xlsx.SetValue(sheet, iRow, 5, row.dpDate.date);
		xlsx.SetStyle(sheet, iRow, 5, {format: "yyyy-mm-dd"});
		xlsx.SetValue(sheet, iRow, 6, dtu.Now());
		xlsx.SetStyle(sheet, iRow, 6, {format: "yyyy-mm-dd"});
		xlsx.SetValue(sheet, iRow, 7, timespan.New(0, 0, row.nbInt.number, row.nbFloat.number, 0));
		xlsx.SetStyle(sheet, iRow, 7, {format: "[hh]:mm:ss.00"});
		xlsx.SetValue(sheet, iRow, 8, timespan.New(0, 0, row.nbInt.number, row.nbFloat.number, 0));
		xlsx.SetValue(sheet, iRow, 9, row.nbFloat.number);
		xlsx.SetStyle(sheet, iRow, 9, {format: "[hh]:mm:ss.00"});
		iRow = iRow+1;
	}

	xlsx.SetColumnWidth(sheet, 0, 40);
	xlsx.SetColumnWidth(sheet, 1, 5);
	xlsx.SetColumnWidth(sheet, 2, 8);
	xlsx.SetColumnWidth(sheet, 3, 12);
	xlsx.SetColumnWidth(sheet, 4, 8);

	let mediaidXlsx = xlsx.Store(filn);
	let filerefXlsx = fileref.New(mediaidXlsx, 0);
	db.rtabFiles.Insert({guid: form.letFileGuid, filn: filn, mediaid: filerefXlsx, dirid: null, type: "xlsx", size: filerefXlsx.Size()});
}

/*
parentControl: <<null>>, 

    submissionTitle: <<null>>, 

    submitButton: <<null>>, 

    t:

        {

            parentControl: <<ref: xlsxmaker>>, 

            rows: [], 

            tbHeaderBool: {parentControl: <<ref: xlsxmaker.t>>, text: ""}, 

            tbHeaderDate: {parentControl: <<ref: xlsxmaker.t>>, text: ""}, 

            tbHeaderFloat: {parentControl: <<ref: xlsxmaker.t>>, text: ""}, 

            tbHeaderInt: {parentControl: <<ref: xlsxmaker.t>>, text: ""}, 

            tbHeaderText: {parentControl: <<ref: xlsxmaker.t>>, text: ""}

        }, 

    tbFilename: {parentControl: <<ref: xlsxmaker>>, text: "aaa111"}, 

    tbSheet: {parentControl: <<ref: xlsxmaker>>, text: "bbb222"}

}

*/

