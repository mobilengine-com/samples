//# server typescript program complex_main for schedule * * * * * first run at 2100-01-01 00:00

// import one or more exports by name
import { libraryFunction, libraryConstant } from "./complex_library";
Log(libraryFunction());
Log(libraryConstant);

// import with a different name
import { piApproximation as pi } from "./complex_library";
Log(pi);

// import the whole module
import * as lib from "./complex_library";
Log(lib.libraryFunction());
