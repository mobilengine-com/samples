//# server typescript program handleConvRes for conversion

//# using reftab conversions;
//# using reftab storeys;

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

const buildingStoreys = conversionResult.metadata.buildings.flatMap(
    builiding =>
        builiding.storeys.map(storey => ({
            builiding,
            storey
        })));

const multipleBuldings = conversionResult.metadata.buildings.length > 1;
let i = 0;
for (const buildingStorey of buildingStoreys) {
    db.storeys.Insert({
        id: guid.Generate().ToStringN(),
        displayName: multipleBuldings
            ? buildingStorey.builiding.name + ": " + buildingStorey.storey.name
            : buildingStorey.storey.name,
        modelId: conversionResult.outputMediaId,
        storeyId: buildingStorey.storey.id,
        modelOrder: i++
    });
}