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

    // strigifies and puts into an array to be joined later
    toStringImpl() {
        let classStr = [`class ${this.className} {\n`];
        if (this.fields.length > 0) {
            classStr.push(
                `${' '.repeat(
                    CodeBuilder.indentSize()
                )}constructor(${this.fields.join(', ')}) {\n`
            );
            for (const field of this.fields) {
                classStr.push(
                    `${' '.repeat(
                        CodeBuilder.indentSize() * 2
                    )}this.${field} = ${field};\n`
                );
            }
            classStr.push(`${' '.repeat(CodeBuilder.indentSize())}}\n`);
        }

        classStr.push('}');
        return classStr.join('');
    }

    toString() {
        return this.toStringImpl();
    }
}

let cb = new CodeBuilder('Person');

cb.addField('name').addField('hairStyle');

console.log(cb.toString());
