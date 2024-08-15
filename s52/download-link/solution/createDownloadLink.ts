//# server typescript program 'createDownloadLink' for report 'report_eachtime_pdf'

const reportDownload = {
    fileref: report.ReportviewId,
}

const otherFile = {
    fileref: '2034ce65680b4245b5621162c709659a'
}

const namedFile = {
    fileref: fileref.New('73194bbb940ac694d607ee88f16dff10', 1),
    name: "very_important_report.pdf"
}

const reportLink = CreateDownloadLink([reportDownload], 'forever', 'unlimited');
Log(['Report link: ', reportLink]);

const fileLink = CreateDownloadLink([otherFile], 'forever', 'unlimited');
Log(['File link: ', fileLink]);

const namedFileLink = CreateDownloadLink([namedFile], 'forever', 'unlimited');
Log(['Named file link: ', namedFileLink]);

const multiFileDownload = CreateDownloadLink([reportDownload, otherFile, namedFile], 'forever', 'unlimited', 'multifile.zip');
Log(['Multifile link: ', multiFileDownload]);

const expiringLink = CreateDownloadLink([reportDownload, otherFile, namedFile],  300, 'unlimited', '5min-expiry.zip');
Log(['Expiring link (5 mins): ', expiringLink]);

const downloadLimitedLink = CreateDownloadLink([reportDownload, otherFile, namedFile], 'forever', 3, '3-download-alls.zip');
Log(['Download limited link (3 downloads): ', downloadLimitedLink]);

const expiredLink = CreateDownloadLink([reportDownload], 0, 0);
Log(['Expired link: ', expiredLink]);