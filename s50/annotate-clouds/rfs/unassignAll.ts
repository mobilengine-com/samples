﻿//# server program unassignAll for schedule * * * * * first run at 2200-01-01 10:00

//# using reftab files;

{
	db.files.UpdateMany(map.New(), {usr: null});
}
