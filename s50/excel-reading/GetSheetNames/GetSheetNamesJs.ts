//# server typescript program GetSheetNamesJs for schedule * * * * * first run at 2100-01-01 00:00
{
    let file = fileref.New("e31de3b074ad410881434cfb5bcf294c", 0);
    let x = excel.FromFileref(file);
    Log(x.SheetNames());
}