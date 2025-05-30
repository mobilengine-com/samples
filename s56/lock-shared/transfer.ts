//#server typescript parallel program transfer for form transferForm
//#using reftab counter;
//#using reftab account;
//#using reftab transfer;
{
	let tform = form as form_transferForm;
	Log(tform);
	Sleep(tform.nWait.number);
	let guidTf = tform.tv_guid.text;
	let existingTransations = db.transfer.Read({ guid: guidTf });
	if (existingTransations.Count() > 0) {
		// error0
		// return;
	}
	else {
		let tf = {
			guid: guidTf,
			acc_num_from: tform.dd_acc_from.selectedKey, acc_num_to: tform.dd_acc_to.selectedKey,
			amount: tform.nb_amount.number, status: 1, status_message: null as (string | null), ver: 0
		};
		Log(["new transfer: ", tf]);
		db.transfer.Insert(tf);

		let accFrom = db.account.LockShared({ acc_num: tf.acc_num_from }).SingleOrDefault();
		Sleep(tform.nWaitLocked.number);
		let accTo = db.account.LockShared({ acc_num: tf.acc_num_to }).SingleOrDefault();
		Sleep(tform.nWaitLocked2.number);
		let bFrom = db.balance.Lock({ acc_num: tf.acc_num_from }).SingleOrDefault();
		Sleep(tform.nWaitLocked.number);
		let bTo = db.balance.Lock({ acc_num: tf.acc_num_to }).SingleOrDefault();
		Sleep(tform.nWaitLocked2.number);

		if (bFrom == null || accFrom == null || accFrom.valid != 1) {
			tf.status = 2; tf.status_message = "account from is not valid";
			db.transfer.Update({ guid: guidTf }, tf);
			// error1
		}
		else if (bTo == null || accTo == null || accTo.valid != 1) {
			tf.status = 3; tf.status_message = "account to is not valid";
			db.transfer.Update({ guid: guidTf }, tf);
			// error2
		}
		else if (bFrom.balance < tf.amount) {
			tf.status = 4; tf.status_message = "account from has not enough money";
			db.transfer.Update({ guid: guidTf }, tf);
			// error3
		} else {
			bFrom.balance = bFrom.balance - tf.amount; accFrom.ver = accFrom.ver + 1;
			bTo.balance = bTo.balance + tf.amount; accTo.ver = accTo.ver + 1;
			db.balance.Update({ acc_num: accFrom.acc_num }, bFrom);
			db.balance.Update({ acc_num: accTo.acc_num }, bTo);

		}
	}
}