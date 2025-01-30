// ------------------------------------------------------------------------------------------------
// Simple HTML templating, escapes parameters by default.
// The html function can be used a tag for a "tagged template literal", see html_reports for 
// an example.
// ------------------------------------------------------------------------------------------------

class SafeHtml implements ISafeHtml {
    value;

    constructor(value) {
        this.value = value;
    }

    toString() {
        return `SafeHtml(${this.value})`;
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

type HtmlTemplateParam = string | SafeHtml | SafeHtml[]

export function html(parts: TemplateStringsArray, ...params: HtmlTemplateParam[]): ISafeHtml {
    let st = '';
    for (let i = 0; i < parts.length - 1; i++) {
        st += parts[i];
        let paramScalarOrArray = params[i];
        let paramArray = Array.isArray(paramScalarOrArray) ? paramScalarOrArray : [paramScalarOrArray];
        for (var param of paramArray) {
            st += param instanceof SafeHtml ? param.value : escape(String(param));
        }
    }
    st += parts[parts.length - 1];
    return new SafeHtml(st);
}

export const safe = (v: any) => new SafeHtml(v);