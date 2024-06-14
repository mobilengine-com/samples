//# server typescript program handleConvRes for conversion

//# using reftab conversions;

Log("Running RFS for conversion result:");
Log(conversionResult);
db.conversions.Update(
    { input: conversionResult.inputMediaId },
    { output: conversionResult.outputMediaId }
);