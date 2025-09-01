function uploadFromMemory() {
    const request = new HttpRequest()
    const requestText = "Hello, world!";
    request.body = new TextEncoder().encode(requestText).buffer;
    request.method = "PUT";
    request.url = "https://httpbin.io/put";
    const response = request.getResponse();
    if ('error' in response) {
        throw new Error("Failed to upload: " + response.error);
    }
    const responseData = response.arrayBuffer();
    const responseText = new TextDecoder().decode(responseData);
    Log(["Put text response", responseText]);
}

function downloadToMemory() {
    const request = new HttpRequest();
    request.method = "GET";
    request.url = "https://placecats.com/300/200"; // returns a 300x200 cat image
    const response = request.getResponse();
    if ('error' in response) {
        throw new Error("Failed to download: " + response.error);
    }
    const arrayBuffer = response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const isJPEG = uint8Array[0] === 0xFF && uint8Array[1] === 0xD8 && uint8Array[2] === 0xFF;
    if (!isJPEG) {
        throw new Error("Downloaded image is not a JPEG");
    }
}

function downloadToStore(): fileref {
    const request = new HttpRequest();
    request.method = "GET";
    request.url = "https://placecats.com/300/200"; // returns a 300x200 cat image
    const response = request.getResponse();
    if ('error' in response) {
        throw new Error("Failed to download: " + response.error);
    }
    const photoFileref = response.store('cat.png');
    const catImage = image.FromFileref(photoFileref);
    Assert(catImage.Width == 300, "Incorrect width");
    Assert(catImage.Height == 200, "Incorrect height");
    return photoFileref;
}

function uploadFromStore(file: fileref) {
    const request = new HttpRequest()
    request.body = file;
    request.method = "PUT";
    request.url = "https://httpbin.io/put";
    const response = request.getResponse();
    if ('error' in response) {
        throw new Error("Failed to upload: " + response.error);
    }
    const responseData = response.arrayBuffer();
    const responseText = new TextDecoder().decode(responseData);
    Log(["Put file response", responseText]);
}

uploadFromMemory();
const catImgFile = downloadToStore();
uploadFromStore(catImgFile);