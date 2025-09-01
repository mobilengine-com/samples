function readFile() {
    var helloWorldFileref = fileref.New("2be064e7b6b74125a416e6e5573d69e3", 0);

    // read binary data
    var data = helloWorldFileref.Read();

    // decode as utf-8, other encodings are not supported
    var text = new TextDecoder().decode(data);

    Log(text);
}

function writeFile() {
    var text = "Some text that you want to save";

    // utf-8 encode text to binary data
    var data = new TextEncoder().encode(text);

    // save it to the media store
    let savedFileref = fileref.Store(data.buffer, "mytext.txt");

    Log(savedFileref)
    Log(["QuickXorHash", savedFileref.QuickXorHash()])
}

readFile();
writeFile();