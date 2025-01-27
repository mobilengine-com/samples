//# server typescript program handleConvRes

//# using reftab models;
//# using reftab storeys;

const conversionResult = params as XktConversionResult

db.models.Insert(
    {
        xktMediaId: conversionResult.outputMediaId,
        ifcMediaId: conversionResult.inputMediaId,
        ifcFilename: fileref.New(conversionResult.inputMediaId, 0).Filename(),
        createDate: dtl.Now().DtlToDtdb()
    });

const buildingStoreys = conversionResult.buildings.flatMap(
    builiding =>
        builiding.storeys.map(storey => ({
            builiding,
            storey
        })));

const multipleBuldings = conversionResult.buildings.length > 1;
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