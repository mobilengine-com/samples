//# server typescript program complex_library for schedule * * * * * first run at 2100-01-01 00:00

// See the docs here:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export

// export a declaration
export function libraryFunction() {
    return "value from imported function";
}
export const libraryConstant = 42;

// export a delcaration later, with the export statement
const anotherConstant = 3.14;
export { anotherConstant };

// export with a different name
export { anotherConstant as piApproximation };

const defaultExport = {
    someValue: 4242,
    someFunction: function () {
        return "SomeFunction called"
    }
};

export default defaultExport;

Log("Watch out!");
Log("This top level code executes once when this library is imported");