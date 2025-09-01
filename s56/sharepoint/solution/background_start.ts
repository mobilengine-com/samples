//# server typescript program background_start

//# using rfs background_result;

import { clientId, cert, certPass, tenantIdBauapp, siteIdBauappKft, testFolderName } from "./constants";

// get the drive id, the customer can also supply this
const connection = Sharepoint.connect(clientId, cert, certPass, tenantIdBauapp);
const drives = connection.getDrives(siteIdBauappKft);
const drive = drives[0];

// make a file to download in the background later
const root = drive.getRoot();
const rootItems = root.getChildren();
let testFolder = rootItems.filter(f => f.name === testFolderName).SingleOrDefault();
testFolder?.delete();
testFolder = root.createFolder(testFolderName);
const uploaded = testFolder.uploadFromStore(fileref.New("605ca0e8522b4e3c8c9aa105e597605b", 0), "sync_upload.bin");

const task = new SharepointFileExchangeTask(clientId, cert, certPass, tenantIdBauapp, siteIdBauappKft, drive.id);
task.uploads.push({
    fileref: fileref.New("605ca0e8522b4e3c8c9aa105e597605b", 0),
    parentId: testFolder.id,
    name: "testfile1.bin",
    conflictBehavior: "rename"
});
task.downloads.push({
    itemId: uploaded.id,
    name: "async_download.bin"
});
StartTask(task, rfs.background_result)