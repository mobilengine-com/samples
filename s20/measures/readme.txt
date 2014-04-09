Running the measurements:

Requirememnts:
Java 1.6 or better

1. Deploy a server instance
2. Run DBFairy with seed
3. Upload merestable100k.refem, merestable10k.refem, merestable1k.refem, meresrfs.rfs, merestable100.xlsx, meresform.fls.xml to Gringotts
4. Assign meresform to Gandalf
5. Change the urls in gatling-charts-highcharts-2.0.0-M3a\user-files\simulations\meres\src\WebformMeres.scala 
6. Start gatling-charts-highcharts-2.0.0-M3a\bin\run.cmd 

The results will be in the folder measures\gatling-charts-highcharts-2.0.0-M3a\results\

Additional info:
The measurement uses the Gatling tool (version 2.0.0-M3a) the script is in the file gatling-charts-highcharts-2.0.0-M3a\user-files\simulations\meres\src\WebformMeres.scala
For help go to http://gatling-tool.org/