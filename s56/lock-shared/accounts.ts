//#client server typescript parallel program accounts for form accounts
//#using reftab counter;
//#using reftab account;
{
	let tform = form as form_accounts;
	Log(tform);
	Sleep(tform.nWait.number);
	Log(`waited ${tform.nWait.number}`);

	for (let row of tform.t.rows) {
		let rgth = db.account.Read({ acc_num: row.recUpd.acc_num });
		//trace row.rec, rgth;  
		if (rgth.Count() == 0) {
			let acc = {
				acc_num: row.recUpd.acc_num, holder_name: row.recUpd.holder_name, balance: row.recUpd.balance,
				valid: row.recUpd.valid, ver: 0
			};
			Log(["new account", acc]);

			db.account.Insert(acc);
		}
	}


	for (let row of tform.t.rows) {
		let x = db.account.LockShared({ acc_num: row.recUpd.acc_num }).SingleOrDefault();
		Log(["shared locked", x?.acc_num]);
	}

	Sleep(tform.nWaitLocked.number);
	Log(`waited ${tform.nWaitLocked.number}`);

	for (let row of tform.t.rows) {
		let th = db.account.Lock({ acc_num: row.recUpd.acc_num }).SingleOrDefault();
		let b = db.balance.Lock({ acc_num: row.recUpd.acc_num }).SingleOrDefault();
		Log(["locked", th]);

		if (th != null && b != null) {
			let accOld = th;
			let accUpd = {
				acc_num: row.recUpd.acc_num, holder_name: row.recUpd.holder_name, balance: row.recUpd.balance,
				valid: row.recUpd.valid, ver: accOld.ver + 1
			};

			if (accOld.holder_name != accUpd.holder_name || b.balance != accUpd.balance
				|| accOld.valid != accUpd.valid) {
				if (row.rec.ver != accOld.ver) {
					// prevent overwrite
					throw "update conflict";
				} else {
					Log(["update: ", accUpd.acc_num, " to ", accUpd]);
					db.account.Update({ acc_num: accUpd.acc_num }, accUpd);
				}
			}
		}
	}

}