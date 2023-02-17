//# server typescript program try_catch for schedule * * * * * first run at 2100-01-01 00:00

//# using reftab myTable;

try {
    db.myTable.Insert({ id: 1 });
    db.myTable.Insert({ id: 1 });
} catch (e) {
    Log(["Caught duplicate key error:", e]);
}

try {
    throw new Error("My error");
} catch (e) {
    Log(["Caught thrown error: ", e]);
}