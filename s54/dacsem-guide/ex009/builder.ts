//# server typescript program builder
//# using dacs lists;
{
    var msg = messages.lists.New();
	msg.Foo.Baz="something";
	msg.Foo.Bars.Add(42);
	msg.Foo.Bars.Add(43);
	msg.Foo.Qux="some other thing";
    msg.Send();
}