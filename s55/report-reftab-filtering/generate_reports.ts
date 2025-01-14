//# server typescript program generate_reports for form report_form
//# using report filtered_report;

const filteredReport = reports.filtered_report;

// ---------------------------------------------------------------------------
let reportRun = filteredReport.New()
reportRun.filters.myTable = {
    textCol: { within: ["alma", "korte"] },
}
reportRun.Params.Add({
    comment: "Filter: textCol=alma or textCol=korte"
})
reportRun.Run();

// ---------------------------------------------------------------------------
reportRun = filteredReport.New()
reportRun.filters.myTable = {
    intCol: { equal: 42 },
}
reportRun.Params.Add({
    comment: "Filter: intCol=42"
})
reportRun.Run();

// ---------------------------------------------------------------------------
reportRun = filteredReport.New()
reportRun.filters.myTable = {
    floatCol: { lessOrEqual: 123.123 },
}
reportRun.Params.Add({
    comment: "Filter: floatCol<=123.123"
})
reportRun.Run();

// ---------------------------------------------------------------------------
reportRun = filteredReport.New()
reportRun.filters.myTable = {
    dateCol: dtl.New(2025, 1, 1, 0, 0, 0, 0).DtlToDtdb()
}
reportRun.Params.Add({
    comment: "Filter: dateCol=2025-01-01 00:00:00"
})
reportRun.Run();

// ---------------------------------------------------------------------------
reportRun = filteredReport.New()
reportRun.filters.myTable = {
    filerefCol: fileref.New("b7ac8a94d2cc44989e8c4d3eb45d4c44", 123),
}
reportRun.Params.Add({
    comment: "Filter: filerefCol=b7ac8a94d2cc44989e8c4d3eb45d4c44|123"
})
reportRun.Run();

// ---------------------------------------------------------------------------
reportRun = filteredReport.New()
reportRun.filters.myTable = {
    filerefCol: null,
}
reportRun.Params.Add({
    comment: "Filter: filerefCol=null"
})
reportRun.Run();