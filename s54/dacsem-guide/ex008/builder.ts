//# server typescript program builder
//# using dacs dacsem;
{
    var msg = messages.dacsem.New();
	var bar = msg.Foo.BarNew();
	bar.Baz = "something";
    msg.Send();
}