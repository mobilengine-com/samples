# Package and Upgrade Sampels

<font color="#de215a">***If you want to try out thies samples, firt upload the base version of the sample. Make sure to upload the xlsx to.***</font>

- **PlainSqlAndRfs**
>A basic package with plain sql, rfs and some test data.

- **CreateNewLikeTheOld**
>Upgrade which is deleting the `base` ref table and creating a new one with the old data plus a new column.

- **MultiuserEdit**
>Adding new rowes to a multiuser table with sql.

### The following samples requires extra sql actions to handle the changes, if this not fulfilled the upgrade gets cancelled.

- **AddNewNotNullColumn**
>Adding a new email column which is notnull and set a standard value on every row.

- **ChangetoNotNullColumn**
>Changing to not null a column which is contains null rows and set a value on every empty cell.

- **ChangeType**
>Changing the type of an existing column, than set the length of the old texts.

- **ChangeSingleUserToMultiUser**
>Changing an existing Single user column to Multiuser and handling the change with sql script.

- **MultiuserFromSimpleTable**
>Adding a new Multiuser column to a table and filling in with users based on a table witch is contains all the users.

