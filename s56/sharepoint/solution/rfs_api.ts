import { clientId, cert, certPass, tenantIdBauapp, siteIdBauappKft, testFolderName } from "./constants";

const connection = Sharepoint.connect(clientId, cert, certPass, tenantIdBauapp);
Log(["Connection", connection]);

const drives = connection.getDrives(siteIdBauappKft);
Log(["Drives", drives]);

const drive = drives[0];
const root = drive.getRoot();
Log(["Drive Root", root]);

const rootItems = root.getChildren();
Log(["Root Items", rootItems]);

let testFolder = rootItems.filter(f => f.name === testFolderName).SingleOrDefault();
Log(["Test Folder", testFolder]);

if (testFolder != null) {
    Log("Removing Test Folder");
    testFolder.delete();
}

testFolder = root.createFolder(testFolderName);
Log(["New test Folder", testFolder]);

const data = new TextEncoder().encode("Hello, World!");
const testFile1 = testFolder.upload(data.buffer, "test.bin");
Log(["TestFile1", testFile1]);

const testFile2 = testFolder.uploadFromStore(fileref.New("605ca0e8522b4e3c8c9aa105e597605b", 0), "test2.bin");
Log(["TestFile2", testFile2]);

const downloadedData = testFile1.download();
const testFile1Contents = new TextDecoder().decode(downloadedData);
Log(["TestFile1Contents", testFile1Contents]);

const downloadedFileref = testFile1.downloadAndStore();
Log(["TestFile1Fileref", downloadedFileref]);

const subFolder = testFolder.createFolder("Subfolder");
Log(["Subfolder", subFolder]);

testFile1.move(subFolder);
Log(["Moved testFile1 to Subfolder", testFile1]);

testFile1.rename("test1_renamed.bin");
Log(["Renamed testFile1", testFile1]);

const copy = testFile2.copy(subFolder);
Log(["Copied testFile to Subfolder", copy]);

Log(["Subfolder contents", subFolder.getChildren()]);
