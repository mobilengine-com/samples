//# server typescript program ReadACellAsStringJs for schedule * * * * * first run at 2100-01-01 00:00
{
    let file = fileref.New("e31de3b074ad410881434cfb5bcf294c", 0);
    let x = excel.FromFileref(file);
    Log("GetText: ");
    Log(x.GetText("Basic", 2, 5));
    Log("GetValue: ");
    Log(x.GetValue("Basic", 2, 5));
}