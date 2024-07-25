//# server typescript program builder
//# using dacs dacsem;
{
    var msg = messages.dacsem.New();
	msg.Foo.Bars.AddNew().Baz = "something";
	msg.Foo.Bars.AddNew().Baz = "some other thing";
    msg.Send();
}