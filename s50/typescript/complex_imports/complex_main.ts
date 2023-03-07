//# server typescript program complex_main for schedule * * * * * first run at 2100-01-01 00:00

// See the docs here:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import

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

// import and use the default export
// (note there are no { } chars surrounding the name)
import defaultExport from "./complex_library";
defaultExport.someFunction();

// side-effect import, only runs the top-level code from the library
// (it only runs once, and it has already ran because of the above 
// imports, so this here doesn't do anything)
import "./complex_library";
