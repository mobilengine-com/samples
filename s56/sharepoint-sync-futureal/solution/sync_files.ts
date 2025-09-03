//# server typescript program sync_files

//# using rfs bg_uploads_result;

import { clientId, cert, certPass, tenantIdBauapp, siteIdBauappKft, syncRootFolderName, state1, state2 } from "./constants";

// TODO: use this to disable logging:
// const log = () => {};
const log = Log;

const connection = Sharepoint.connect(clientId, cert, certPass, tenantIdBauapp);
const drives = connection.getDrives(siteIdBauappKft);
// TODO: you will need to get the drive by name or id, the customer should tell you
const drive = drives[0];
const root = drive.getRoot();
const rootItems = root.getChildren();
let syncFolder = rootItems.filter(f => f.name === syncRootFolderName).SingleOrDefault();
if (syncFolder == null) {
    syncFolder = root.createFolder(syncRootFolderName);
}

const getChildrenCache = new Map<DriveItem, DriveItem[]>();
function getChildren(driveItem: DriveItem): DriveItem[] {
    if (getChildrenCache.has(driveItem)) {
        return getChildrenCache.get(driveItem)!;
    }

    const children = driveItem.getChildren();
    getChildrenCache.set(driveItem, children);
    return children;
}

const uploadTask = new SharepointFileExchangeTask(clientId, cert, certPass, tenantIdBauapp, siteIdBauappKft, drive.id);

// TODO: get these from querying bauapp tables
const state = Math.random() > 0.5 ? state1 : state2;
const bauFoldersAll = state.folderStructure;
const bauFilesAll = state.files;

function sync(spParent: DriveItem, bauFolders: reftab_row_bau_folder_structure_details[], log: (message: string) => void) {
    log("Syncing spFolder: " + spParent.name);

    const logNotIndented = log;
    log = (message: string) => logNotIndented("  " + message);

    Assert(spParent.isFolder, "syncing non-folder?");
    const spFolders = getChildren(spParent).filter(f => f.isFolder);
    log("Found spFolders: " + spFolders.map(f => f.name).join(", "));

    // remove extra folders in sharepoint
    for (const existingFolder of spFolders) {
        if (!bauFolders.some(f => f.folder_name === existingFolder.name)) {
            log("Deleting spFolder: " + existingFolder.name);
            existingFolder.delete();
        }
    }

    // create missing folders in sharepoint & descend
    for (const bauFolder of bauFolders) {
        let spFolder = spFolders.filter(f => f.name === bauFolder.folder_name).SingleOrDefault();
        if (!spFolder) {
            log("Creating spFolder: " + bauFolder.folder_name);
            spFolder = spParent.createFolder(bauFolder.folder_name);
        }

        // sync files in folder
        syncFiles(bauFolder, spFolder, log);

        // check subfolders
        let bauSubFolders = bauFoldersAll.filter(f => f.parent_id === bauFolder.folder_id);
        sync(spFolder, bauSubFolders, log);
    }
}

function syncFiles(bauFolder: reftab_row_bau_folder_structure_details, spFolder: DriveItem, log: (message: string) => void) {
    const bauFiles = bauFilesAll.filter(f => f.folder_id === bauFolder.folder_id);
    const spFiles = getChildren(spFolder).filter(f => !f.isFolder);
    log("Found spFiles: " + spFiles.map(f => f.name).join(", "));

    // upload missing files
    for (const bauFile of bauFiles) {
        let spFile = spFiles.filter(f => f.name === spFilename(bauFile)).SingleOrDefault();
        if (!spFile) {
            log("Scheduling upload for file: " + spFilename(bauFile));
            // TODO: maybe add a limit, so that we dont upload thousands of files in a single task?
            uploadTask.uploads.push({
                parentId: spFolder.id,
                name: spFilename(bauFile),
                fileref: fileref.New(bauFile.file_guid, 0)
            });
        }
    }

    // delete extra files
    for (const spFile of spFiles) {
        if (!bauFiles.some(f => spFile.name === spFilename(f))) {
            log("Deleting spFile: " + spFile.name);
            spFile.delete();
        }
    }
}

function spFilename(bauFile: reftab_row_bau_virtual_files) {
    // TODO: maybe add a version here?
    return `${bauFile.name}.${bauFile.extension}`;
}

const bauRootFolders = bauFoldersAll.filter(f => f.parent_id == null || f.parent_id.trim() === "");
sync(syncFolder, bauRootFolders, log);

log(`Scheduling ${uploadTask.uploads.length} uploads`)
if (uploadTask.uploads.length > 0) {
    StartTask(uploadTask, rfs.bg_uploads_result);
}
