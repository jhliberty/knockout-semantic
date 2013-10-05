$('.codeTarget').each(function () {
    var code = $(this).prev().html();
    var $pre = $("<pre class='prettyprint'>");

    code = html_beautify(code, {
        /*wrap_line_length: 78*/
    });

    code = code.replace(/[<"]|data-bind|>(?=\s*\w)/g, function(m){
        switch (m) {
            case "<": return "\n&lt;";
            case ">": return "&gt;\n  ";
            case '"': return "&quot;";
            case "data-bind": return "\n     data-bind";
        }
    }).trim();

    $pre.html(code);
    console.log(code);
    $(this).append($pre);
});
