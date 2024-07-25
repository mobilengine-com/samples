//# server typescript program builder
//# using dacs dacsem;
{
    var dtfDate = dtf.Parse('yyyy "-" MM "-" dd');
    var msg = messages.dacsem.New();
    var order = msg.purchaseOrder;

    order.orderDate = dtu.Parse(dtfDate, "1999-10-20");
    order.shipTo.name = "Alice Smith";
    order.shipTo.country = "US";
    order.shipTo.street = "123 Maple Street";
    order.shipTo.city = "Mill Valley";
    order.shipTo.state = "CA";
    order.shipTo.zip = 90952;
    
    order.billTo.name = "Robert Smith";
    order.billTo.country = "US";
    order.billTo.street = "8 Oak Avenue";
    order.billTo.city = "Old Town";
    order.billTo.state = "PA";
    order.billTo.zip = 95819;
    
    order.comment = "Hurry, my lawn is going wild!";
    var itemLawnower = order.items.AddNew();
    itemLawnower.partNum = "872-AA";
    itemLawnower.productName = "Lawnmower";
    itemLawnower.quantity = 1;
    itemLawnower.USPrice = 148.95;
    itemLawnower.comment = "Confirm this is electric";
    
    var itemBabyMonitor = order.items.AddNew();
    itemBabyMonitor.partNum = "926-AA";
    itemBabyMonitor.productName = "Baby Monitor";
    itemBabyMonitor.quantity = 1;
    itemBabyMonitor.USPrice = 39.98;
    itemBabyMonitor.shipDate = dtu.Parse(dtfDate, "1999-05-21");
    
    msg.Send();
}