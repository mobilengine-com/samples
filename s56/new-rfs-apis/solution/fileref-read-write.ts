function storePersonData() {
    const personData = {
        name: "John Doe",
        age: 30,
        email: "john.doe@example.com"
    };
    const text = JSON.stringify(personData, null, 2);
    const arrayBuffer = new TextEncoder().encode(text).buffer;
    const personFileref = fileref.Store(arrayBuffer, "person.json");
    return personFileref;
}

function readPersonData(file: fileref) {
    const arrayBuffer = file.Read();
    const text = new TextDecoder().decode(arrayBuffer);
    const personData = JSON.parse(text);
    return personData;
}

const f = storePersonData();
Log(readPersonData(f));