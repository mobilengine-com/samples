//# server typescript program GetRowAndColumnCountJs for schedule * * * * * first run at 2100-01-01 00:00
{
    let file = fileref.New("e31de3b074ad410881434cfb5bcf294c", 0);
    let workbook = excel.FromFileref(file);
    Log("Row: "+workbook.RowCount("Basic"));
    Log("Column: "+workbook.ColumnCount("Basic"));
}