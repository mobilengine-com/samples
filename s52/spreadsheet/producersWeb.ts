//# server typescript program producersWeb for form producersWeb
//# using reftab producer;

{
  for (let row of form.tblProducer.rows) {
    if (row.letProducer.guid == null) {
      db.producer.Insert({guid: guid.Generate().ToStringN(), name: row.letProducer.name, description: row.letProducer.description});
    }
  }
}