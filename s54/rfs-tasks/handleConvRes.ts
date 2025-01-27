//# server typescript program handleConvRes

//# using reftab conversions;

Log("Running RFS for conversion result:")
Log(params);

const convRes = params as XktConversionResult;
db.conversions.Update(
    { input: convRes.inputMediaId },
    { output: convRes.outputMediaId }
);