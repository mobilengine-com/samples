// ------------------------------------------------------------------------------------------------
// Simple HTML templating, escapes parameters by default.
// The html function can be used a tag for a "tagged template literal", see html_reports for 
// an example.
// ------------------------------------------------------------------------------------------------

class Raw {
    value;

    constructor(value) {
        this.value = value;
    }
}

const lookup = {
    '&': "&amp;",
    '"': "&quot;",
    '\'': "&apos;",
    '<': "&lt;",
    '>': "&gt;"
};

function escape(s) {
    return s.replace(/[&"'<>]/g, c => lookup[c]);
}

export function html(parts: TemplateStringsArray, ...params: any[]) {
    let st = '';
    for (let i = 0; i < parts.length - 1; i++) {
        st += parts[i];
        const param = params[i];
        st += param instanceof Raw ? param.value : escape(String(param));
    }
    st += parts[parts.length - 1];
    return st;
}

export const raw = (v: any) => new Raw(v);