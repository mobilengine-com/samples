//# server typescript program builder
//# using dacs Foo;
{
    let msg = messages.Foo.New();
	let foo = msg.Foo;
    foo.Bar="baz";
    msg.Send();
}