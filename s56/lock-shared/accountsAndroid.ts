//#client server typescript parallel program accountsAndroid for form accountsAndroid
//#using reftab counter;
//#using reftab account;
{


  for (let row of db.account.Read({}))
  {
    let acc = db.account.LockShared({acc_num: row.acc_num}).SingleOrDefault();
    Log([ "shared locked", acc?.acc_num ]);
  }

  Sleep(2000);
  Log(`waited ${2000}`);
  
  for (let row of db.account.Read({}))
  {
    let acc = db.account.Lock({acc_num: row.acc_num});
    Log([ "locked", acc ]);
 }

}