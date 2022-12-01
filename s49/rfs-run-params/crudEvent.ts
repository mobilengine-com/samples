//# server program crudEvent for form form4rfs
//# using reftab event;
//# using rfs crudEvent_sched;
{
  Log(["form", form]);
  for (let i =0; i<100; i=i+1) {
    var rfsSched = rfs.crudEvent_sched.New();
    rfsSched.SetParams({
      index: i,
      stIndex: i.ToString(),
      fEven: i%2==0,
      floatVal: i+0.5,
      listOfVal: [i, i+1, i+2, [i+3, i+4]],
      mapOfVal: {alma: i+1, korte: [i+2]},
      nowLocal: dtl.Now(),
      nowDtdbFromLocal: dtl.Now().DtlToDtdb(),
      nowDtdbFromUtc: dtu.Now().DtuToDtdb(),
      nowUtc: dtu.Now(),
      ts: timespan.New(0, 0, 2, 0, 0)
    });
    rfsSched.SetPriority("high");
    rfsSched.Run();

    db.event.Insert({guid: guid.Generate().ToStringN(), name: "alma", description: "descr"});
    let value = {guid: guid.Generate().ToStringN(), name: "row.tbName.text", guidAgent: null, description: "descr"};
  
  }

}