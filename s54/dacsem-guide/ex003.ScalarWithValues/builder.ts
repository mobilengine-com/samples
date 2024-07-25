//# server typescript program builder
//# using dacs dacsem;
{
    let msg = messages.dacsem.New();
	let foo = msg.Foo;
    foo.a=1;
	foo.b = 1.0;
	foo.c = "alma";
	foo.d = 1;
	foo.e = 3.0;
	foo.f = "körte";
	foo.g = "körte";
    msg.Send();
}