//# server typescript program CloseOpenedExcelJs for schedule * * * * * first run at 2100-01-01 00:00
{
    let file = fileref.New("e31de3b074ad410881434cfb5bcf294c", 0);
    let x = excel.FromFileref(file);
    Log(x.GetValue("Basic", 2, 1));
    x.Close();
    try {
        x.GetValue("Basic", 2, 1);
    } catch(e) {
        Log("Now the excel file is released so other scripts can use it but we are not right now");
        Log(e); 
    }
}