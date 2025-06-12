//# server typescript program RtabOrderLimitOffset for schedule * * * * * first run at 2100-01-01 10:00
//# using reftab FRUIT500;

Log("cheapest fruits first (long version)");
Log(db.FRUIT500.Read({
	_orderBy: [
		{
			column: "Price",
			direction: "desc"
		},
		"Fruit"
	]
}));

Log("cheapest fruits first (short version)");
Log(db.FRUIT500.Read({
	_orderBy: [
		// this function just returns the same object that you see above
		db.desc("Price"),
		"Fruit"
	]
}));
