class CodeBuilder {
    static indentSize() {
        return 2;
    }

    constructor(className) {
        this.className = className;
        this.fields = [];
    }

    addField(name) {
        this.fields.push(name);
        return this;
    }

    toStringImpl() {
        let classStr = [`class ${this.className} {\n`];
        for (field of this.fields) {
        }
    }

    toString() {}
}
