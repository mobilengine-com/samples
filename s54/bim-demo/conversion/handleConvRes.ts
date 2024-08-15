//# server typescript program handleConvRes for conversion

//# using reftab conversions;

let filename = null;
if (conversionResult.outputMediaId) {
    let fr = fileref.New(conversionResult.outputMediaId, 0);
    filename = fr.Filename();
}

db.conversions.Update(
    {
        input: conversionResult.inputMediaId
    },
    {
        output: conversionResult.outputMediaId,
        outputFilename: filename,
        end: dtl.Now().DtlToDtdb()
    }
);