"use strict";

import fs from "fs";
import crypto from "crypto";
import ViewCompiler from "./view-compiler";

var $compile_path,
    $footer = [],
    $tags = [
        // TODO
        [
            /(?:\{\{([^{}]+)\}\})/gm,
            (match, value) => {
                return "\" + " + value + " + \"";
            }
        ],
        [
            /(?:\{\{\{([^{}]+)\}\}\})/gm,
            (match, value) => {
                return "\" + " + value + " + \"";
            }
        ],
        [
            /(?:\{\!\!([^{}!]+)\!\!\})/gm,
            (match, value) => {
                return "\" + " + value + " + \"";
            }
        ]
    ],
    $directives = {
        "if": (options) => {
            return "if" + (typeof options !== "undefined" ? " (" + options + ") {\n" : "{\n");
        },
        "else": () => {
            return "} else {";
        },
        "elseif": (options) => {
            return "} else if" + (typeof options !== "undefined" ? " (" + options + ") {\n" : "{\n");
        },
        "endif": () => {
            return "}\n";
        },
        "for": (options) => {
            return "for" + (typeof options !== "undefined" ? " (" + options + ") {\n" : "{\n");
        },
        "endfor": () => {
            return "}\n";
        },
        "while": (options) => {
            return "while" + (typeof options !== "undefined" ? " (" + options + ") {\n" : "{\n");
        },
        "endwhile": () => {
            return "}\n";
        },
        "break": () => {
            return "break;\n"
        },
        "continue": () => {
            return "continue;\n";
        },
        "yield": (options) => {
            return "$print += yield $factory.yield(" + options + ");\n";
        },
        "section": (options) => {
            return "$factory.inject(" + options + ", (() => {\n var $print = \"\";\n";
        },
        "endsection": () => {
            return "return $print;\n })());\n";
        },
        "extends": (options) => {
            $footer.push("$print = yield $factory.render(" + options + ", $defined_vars);\n");

            return "";
        }
    };

async function compile(value) {
    var result = "";

    // TODO: improve regex matching & delete this temporary fix
    if (value.startsWith('@')) {
        value = " " + value;
    }

    value.replace(/([^@]+)(?:@(\w+)(?:[ \t]*)(?:(?:\()([^()]+)(?:\)))?)?/gm, (match, string, directive, options) => {
        if (typeof string !== "undefined" && string != "") {
            var matches = [];

            for (var tag of $tags) {
                var [regex] = tag;

                string.replace(regex, function () {
                    matches.push(Array.from(arguments));
                });
            }

            var compiled = "$print += " + JSON.stringify(string) + ";\n";

            for (var tag of $tags) {
                var [regex, resolver] = tag;

                compiled = compiled.replace(regex, () => {
                    return resolver.apply(this, matches.shift());
                });
            }

            result += compiled;
        }

        if (typeof $directives[directive] !== "undefined") {
            result += $directives[directive].apply(this, [options]);
        }
    });

    for (var foot of $footer) {
        result += foot;
    }

    $footer = [];

    return "\"use strict\";\n" +
        "$async(function *(){\n" +
        "var $print = \"\";\n" +
        result +
        "return $print;\n" +
        "});";
};

class BladeViewCompiler extends ViewCompiler {
    constructor(compilePath) {
        super();

        $compile_path = compilePath;
    }

    async isExpired(path) {
        var $this = this;

        return await new Promise((resolve, reject) => {
            fs.stat(path, (error, stats) => {
                if (error) {
                    reject(error);
                }

                fs.stat($this.compiled(path), (error, compiled) => {
                    if (error) {
                        resolve(true);
                    } else {
                        resolve(stats.mtime >= compiled.mtime);
                    }
                });
            });
        });
    }

    compiled(path) {
        return $compile_path + "/" + crypto.createHash("sha1").update(path).digest("hex") + ".js";
    }

    async compile(path) {
        var $this = this;
        var content = await new Promise((resolve, reject) => {
            fs.readFile(path, "utf-8", (error, content) => {
                if (error) {
                    reject(error);
                }

                resolve(content);
            });
        });

        var compiled = await compile(content);

        await new Promise((resolve, reject) => {
            fs.writeFile($this.compiled(path), compiled, (error) => {
                if (error) {
                    reject(error)
                }

                resolve(compiled);
            });
        });

        return compiled;
    }

    async compileString(value) {
        return await compile(value);
    }

    get compile_path() {
        return $compile_path;
    }

    get directives() {
        return $directives;
    }
}

export default BladeViewCompiler;