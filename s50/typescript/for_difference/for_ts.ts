//# server typescript program for_ts for schedule * * * * * first run at 2100-01-01 00:00

{
    // prints the keys of the array object: "0", "1", "2", "Clone", "Add", ...
    Log("for (let i in [1,2,3])")
    Log("----------------------")
    for (let i in [1,2,3]) {
        Log(i);
    }

    // prints 1,2,3
    Log("for (let i of [1,2,3])")
    Log("----------------------")
    for (let i of [1,2,3]) {
        Log(i);
    }

    // prints the keys on the map: "a", "b", "Count", "Clone", ...
    Log("for (let i in {a: 1, b: 2})")
    Log("---------------------------")
    for (let i in {a: 1, b: 2}) {
        Log(i);
    }

    // proper way to get all keys of a map
    Log("for (let i of Object.keys({a: 1, b: 2}))")
    Log("----------------------------------------")
    for (let i of Object.keys({a: 1, b: 2})) {
        Log(i);
    }

    // this also works
    Log("for (let i of {a: 1, b: 2}.Keys()")
    Log("---------------------------------")
    for (let i of {a: 1, b: 2}.Keys()) {
        Log(i);
    }
}