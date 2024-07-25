//# server typescript program builder
//# using dacs dacsem;
{
    var msg = messages.dacsem.New();
	var foo = msg.Foo;
    foo.a=123;
	foo.b = 123.21;
	foo.c = dtl.Parse(dtf.Parse('(dtf MM "/" dd "/" yyyy " " HH ":" mm ":" ss "." S o)'), "06/21/2012 15:33:44.549+02:00");
	foo.d = dtu.Parse(dtf.Parse('(dtf MM "/" dd "/" yyyy " " HH ":" mm ":" ss "." S o)'), "06/21/2012 13:33:45.357Z");
	foo.e = "alma";
	foo.f = 123;
	foo.g = 123.21;
	foo.h = dtl.Parse(dtf.Parse('(dtf MM "/" dd "/" yyyy " " HH ":" mm ":" ss "." S o)'), "06/21/2012 15:33:44.549+02:00");
	foo.i = dtu.Parse(dtf.Parse('(dtf MM "/" dd "/" yyyy " " HH ":" mm ":" ss "." S o)'), "06/21/2012 13:33:45.357Z");
	foo.j = "    almafa    ";
	foo.k = "    almafa    ";
    msg.Send();
}