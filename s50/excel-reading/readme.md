# Excel Reading in rfs

>Before try out any sample, please upload the BaseData.xlsx file with the following mediaId: <b>"e31de3b074ad410881434cfb5bcf294c"</b> <br>
>>Hint: mebt upload-file -u\<username\> -p\<password\> -c \<CompanyId\> -s \<ComexUrl\> .\BaseData.xlsx  e31de3b074ad410881434cfb5bcf294c

- **ReadACell**
Reading a single cell from the previously uploaded excel file.<br>
<b>GetValue(\<SheetName\>, \<RowId\>, \<ColumnId\>)</b>

- **GetSheetNames**
Reading out all the names from the existing sheets and geting back in one list of strings. <br>
<b>SheetNames()</b>

- **GetRowAndColumnCount**
Give back the highest in use row and column count.<br>
<b>RowCount(\<SheetName\>)</b><br>
<b>ColumnCount(\<SheetName\>)</b>

- **CloseOpenedExcel**
Releaseing the excel file.<br>
<b>Close()</b>