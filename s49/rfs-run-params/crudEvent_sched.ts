//# server program crudEvent_sched for schedule 1,31 * * * * first run at 2222-05-26 04:00
//# using reftab event;
{
  Log(["params", params]);
  Log(["index", params.index]);
  db.event.Insert({guid: guid.Generate().ToStringN(), name: "alma", description: "descr"});
}