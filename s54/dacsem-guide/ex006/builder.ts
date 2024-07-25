//# server typescript program builder
//# using dacs dacsem;
{
    var msg = messages.dacsem.New();
	msg.Foo.Bar = "something";
	msg.Foo.Baz = 42;
    msg.Send();
}