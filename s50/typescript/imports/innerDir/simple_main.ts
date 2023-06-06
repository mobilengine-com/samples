//# server typescript program simple_main for schedule * * * * * first run at 2100-01-01 00:00

// ./outer_library and ../outer_library do not work here
// (the latter only works in vscode, not with mebt)
import { outerLibFunction } from "outer_library";

// the ./ below is optional
import { innerLibraryVariable } from "./inner_library";

Log(innerLibraryVariable);
Log(outerLibFunction());