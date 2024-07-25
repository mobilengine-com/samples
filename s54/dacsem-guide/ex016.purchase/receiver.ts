//# server typescript program receiver for dacs dacsem
{
    Log(dacs);
    let d: dacsem_in_dacsem = dacs;
    Log(d.purchaseOrder?.billTo?.city);
    for (let item of d.purchaseOrder.items) {
        Log(item);
    }
}