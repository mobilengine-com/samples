//# server typescript program ReadAllDataJs for form ReadAllData
{
    Log(form);
    let file = form.filupl.filerefs[0].fileref;
    let workbook = excel.FromFileref(file);
    let worksheets = workbook.SheetNames();
    for (let worksheet of worksheets) {
        let rows = workbook.RowCount(worksheet);
        let columns = workbook.ColumnCount(worksheet);
        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                var value = workbook.GetValue(worksheet, row, column);
                Log([`${worksheet}(${row}, ${column})`, value]);
            }
        }
    }
    workbook.Close();
}