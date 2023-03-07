//# server typescript program loop_capture_ts for schedule * * * * * first run at 2100-01-01 00:00

{
    // This code prints 1,2,3
    // using var everywhere here makes this code compatible with RFS
    let funs = [];
    for (let i of [1, 2, 3]) {
        funs.Add(function () { Log(i); });
    }
    for (let fun of funs) {
        fun();
    }
}