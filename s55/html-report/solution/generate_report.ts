//# server typescript program generate_report for form report_form
//# using reftab reports;

import { generateReport, Photo, ReportInput } from "./html_report";

const reportInput = {
    title: "Your Report",
    intro: "This is the HTML-based report from the photos you uploaded.",
    photos: form.photos.rows.map(row => ({
        mediaId: row.photo.photos[0].photoId,
        description: row.description.text
    } as Photo))
} as ReportInput;
const reportHtml = generateReport(reportInput);
const reportDocument = reportHtml.print();
const reportId = reportDocument.Store('report.pdf')
Log(`Report saved with id ${reportId}`)
db.reports.Insert({ id: reportId, date: dtl.Now().DtlToDtdb() });
