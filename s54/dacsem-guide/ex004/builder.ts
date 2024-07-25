//# server typescript program builder
//# using dacs meta42;

{
    let msg = messages.meta42.New();
	msg.Foo = 42;
    msg.Send();
}