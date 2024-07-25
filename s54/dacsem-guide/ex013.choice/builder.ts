//# server typescript program builder
//# using dacs dacsem;
{ 
	var meta42=messages.dacsem.New();
	var foo = meta42.Foo;
	foo.BarBaz.AddNew().Bar = 42;
	foo.BarBaz.AddNew().Baz = "something";
	foo.BarBaz.AddNew().Baz = "some other thing";
	foo.BarBaz.AddNew().Bar = 43;
	meta42.Send();
}