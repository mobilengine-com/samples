//# server typescript program receiver for dacs dacsem
{
    Log(dacs);
    let d: dacsem_in_dacsem = dacs;
    Log(d.Foo.BarBaz);
    for (let item of d.Foo.BarBaz) {
        Log(item);
    }
}