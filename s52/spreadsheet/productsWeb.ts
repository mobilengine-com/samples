//# server typescript program productsWeb for form productsWeb
//# using reftab product;
//using dacs ProductVignetteRequest as req;

{
  Log([form]);
  if (form.submitButton === form.btnSave) {
    for (let row of form.tblProduct.rows) {
      if (row.letFNew) {
        let product = {
          guid: guid.Generate().ToStringN(), 
          name: row.tbName.text, 
          guidProducer: row.ddProducer.selectedKey,
          itemNumber: row.tbItemNumber.text,
          dtlIntroduced: row.dpDtlIntroduced.date === null? null : row.dpDtlIntroduced.date.DtlToDtdb(),
          urlDatasheet: row.tbUrlDatasheet.text,
          urlDoP: row.tbUrlDoP.text,
          urlBIMObject: row.tbUrlBIMObject.text,
          urlOther: row.tbUrlOther.text,
          tsMinSomething: row.tpTsMinSomething.seconds === null ? null : row.tpTsMinSomething.seconds/60,
          filerefVignette: null
        };
        db.product.Insert(product);
/*
        var reqDacs = messages.req.New();

        reqDacs.Product.guid = product.guid;
        reqDacs.Send();*/
      }
    }
  }
}
