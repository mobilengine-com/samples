//# server typescript program builder
//# using dacs dacsem;
{ 
	let msg=messages.dacsem.New();
	let foo=msg.Foo;
  
	msg.Foo.BarBaz.AddNew().BarNew().Qux = 42;
	msg.Foo.BarBaz.AddNew().BazNew().Quux = "something";
	msg.Foo.BarBaz.AddNew().BazNew().Quux = "some other thing";
	msg.Foo.BarBaz.AddNew().BarNew().Qux = 43;	

	msg.Send();
}