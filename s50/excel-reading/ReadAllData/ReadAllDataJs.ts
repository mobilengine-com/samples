//# server typescript program ReadAllDataJs for schedule * * * * * first run at 2100-01-01 00:00
{
    let file = fileref.New("e31de3b074ad410881434cfb5bcf294c", 0);
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