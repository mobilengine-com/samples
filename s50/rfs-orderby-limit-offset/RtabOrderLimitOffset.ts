//# server typescript program RtabOrderLimitOffset for schedule * * * * * first run at 2100-01-01 10:00
//# using reftab FRUIT500;

{

	Log("first fruit by price");
	Log(db.FRUIT500.Read({
		Fruit: {
			greaterOrEqual: "Apple", 
			lessOrEqual: "Lemon"
		},
		_orderBy: ["Price"],
		_limit: 1
	}).SingleOrDefault());


	Log("fruits ordered by type, name");
	Log(db.FRUIT500.Read({
		Fruit: {
			greaterOrEqual: "Apple", 
			lessOrEqual: "Lemon"
		},
		_orderBy: ["Type", "Fruit"]
	}));

	const lim = 5;
	let offs = 1;
	while (true) {
		Log("fruits filtered and ordered by price, from "+offs.ToString()+" in a page of "+lim.ToString());
		let fruits = db.FRUIT500.Read({
			Fruit: {
				greaterOrEqual: "Apple", 
				lessOrEqual: "Lemon"
			},
			Price: {
				notEqual: 500
			},
			Quantity: {
				greaterThan: 120.0, 
				lessThan: 200.0
			},
			_orderBy: ["Price"],
			_limit: lim,
			_offset: offs
		});
		Log(fruits);
		offs = offs + 5;
		if (fruits.length<5)
			break;
	}

}