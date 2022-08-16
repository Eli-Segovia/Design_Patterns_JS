# Single Responsiblity Principle

Basically a class should only have one purpose. We do not want to make a god class, a class that can do everything. This leads to spaghetti code.

Example:

```js
const fs = require('fs');

class Journal {
    constructor() {
        this.entries = {};
    }

    addEntry(text) {
        let c = ++Journal.count;
        let entry = `${c}: ${text}`;
        this.entries[c] = entry;
        return c;
    }

    removeEntry(index) {
        delete this.entries[index];
    }

    toString() {
        return Object.values(this.entries).join('\n');
    }

    // save(filename)
    // {
    //   fs.writeFileSync(filename, this.toString());
    // }
    //
    // load(filename)
    // {
    //   //
    // }
    //
    // loadFromUrl(url)
    // {
    //   //
    // }
}
Journal.count = 0;

class PersistenceManager {
    preprocess(j) {
        //
    }

    saveToFile(journal, filename) {
        fs.writeFileSync(filename, journal.toString());
    }
}

let j = new Journal();
j.addEntry('I cried today.');
j.addEntry('I ate a bug.');
console.log(j.toString());

let p = new PersistenceManager();
let filename = 'c:/temp/journal.txt';
p.saveToFile(j, filename);
```

Notice here that the journal only focuses on adding and removing entries concerned with the journal. The persistence manager is a completely seperate class that is used to write the journal and work with anything persistence-related. Keeping these classes seperate ensures the single-responsibility principle.
