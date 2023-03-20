//# server typescript program CloseOpenedExcelJs for schedule * * * * * first run at 2100-01-01 00:00
{
    let file = fileref.New("e31de3b074ad410881434cfb5bcf294c", 0);
    let workbook = excel.FromFileref(file);
    Log(workbook.GetValue("Basic", 1, 0));
    workbook.Close();
    try {
        workbook.GetValue("Basic", 1, 0);
    } catch(e) {
        Log("The workbook is closed, it's not usable anymore");
        Log(e); 
    }
}