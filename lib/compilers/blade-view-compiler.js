"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _from = require("babel-runtime/core-js/array/from");

var _from2 = _interopRequireDefault(_from);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let compile = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (value) {
        var _this = this;

        var result = "";

        // TODO: improve regex matching & delete this temporary fix
        if (value.startsWith('@')) {
            value = " " + value;
        }

        value.replace(/([^@]+)(?:@(\w+)(?:[ \t]*)(?:(?:\()([^()]+)(?:\)))?)?/gm, function (match, string, directive, options) {
            if (typeof string !== "undefined" && string != "") {
                var matches = [];

                for (var tag of $tags) {
                    var [regex] = tag;

                    string.replace(regex, function () {
                        matches.push((0, _from2.default)(arguments));
                    });
                }

                var compiled = "$print += " + (0, _stringify2.default)(string) + ";\n";

                for (var tag of $tags) {
                    var [regex, resolver] = tag;

                    compiled = compiled.replace(regex, function () {
                        return resolver.apply(_this, matches.shift());
                    });
                }

                result += compiled;
            }

            if (typeof $directives[directive] !== "undefined") {
                result += $directives[directive].apply(_this, [options]);
            }
        });

        for (var foot of $footer) {
            result += foot;
        }

        $footer = [];

        return "\"use strict\";\n" + "$async(function *(){\n" + "var $print = \"\";\n" + result + "return $print;\n" + "});";
    });

    return function compile(_x) {
        return _ref.apply(this, arguments);
    };
})();

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _crypto = require("crypto");

var _crypto2 = _interopRequireDefault(_crypto);

var _viewCompiler = require("./view-compiler");

var _viewCompiler2 = _interopRequireDefault(_viewCompiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $compile_path,
    $footer = [],
    $tags = [
// TODO
[/(?:\{\{([^{}]+)\}\})/gm, (match, value) => {
    return "\" + " + value + " + \"";
}], [/(?:\{\{\{([^{}]+)\}\}\})/gm, (match, value) => {
    return "\" + " + value + " + \"";
}], [/(?:\{\!\!([^{}!]+)\!\!\})/gm, (match, value) => {
    return "\" + " + value + " + \"";
}]],
    $directives = {
    "if": options => {
        return "if" + (typeof options !== "undefined" ? " (" + options + ") {\n" : "{\n");
    },
    "else": () => {
        return "} else {";
    },
    "elseif": options => {
        return "} else if" + (typeof options !== "undefined" ? " (" + options + ") {\n" : "{\n");
    },
    "endif": () => {
        return "}\n";
    },
    "for": options => {
        return "for" + (typeof options !== "undefined" ? " (" + options + ") {\n" : "{\n");
    },
    "endfor": () => {
        return "}\n";
    },
    "while": options => {
        return "while" + (typeof options !== "undefined" ? " (" + options + ") {\n" : "{\n");
    },
    "endwhile": () => {
        return "}\n";
    },
    "break": () => {
        return "break;\n";
    },
    "continue": () => {
        return "continue;\n";
    },
    "yield": options => {
        return "$print += yield $factory.yield(" + options + ");\n";
    },
    "section": options => {
        return "$factory.inject(" + options + ", (() => {\n var $print = \"\";\n";
    },
    "endsection": () => {
        return "return $print;\n })());\n";
    },
    "extends": options => {
        $footer.push("$print = yield $factory.render(" + options + ", $defined_vars);\n");

        return "";
    }
};

;

class BladeViewCompiler extends _viewCompiler2.default {
    constructor(compilePath) {
        super();

        $compile_path = compilePath;
    }

    isExpired(path) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            var $this = _this2;

            return yield new _promise2.default(function (resolve, reject) {
                _fs2.default.stat(path, function (error, stats) {
                    if (error) {
                        reject(error);
                    }

                    _fs2.default.stat($this.compiled(path), function (error, compiled) {
                        if (error) {
                            resolve(true);
                        } else {
                            resolve(stats.mtime >= compiled.mtime);
                        }
                    });
                });
            });
        })();
    }

    compiled(path) {
        return $compile_path + "/" + _crypto2.default.createHash("sha1").update(path).digest("hex") + ".js";
    }

    compile(path) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            var $this = _this3;
            var content = yield new _promise2.default(function (resolve, reject) {
                _fs2.default.readFile(path, "utf-8", function (error, content) {
                    if (error) {
                        reject(error);
                    }

                    resolve(content);
                });
            });

            var compiled = yield compile(content);

            yield new _promise2.default(function (resolve, reject) {
                _fs2.default.writeFile($this.compiled(path), compiled, function (error) {
                    if (error) {
                        reject(error);
                    }

                    resolve(compiled);
                });
            });

            return compiled;
        })();
    }

    compileString(value) {
        return (0, _asyncToGenerator3.default)(function* () {
            return yield compile(value);
        })();
    }

    get compile_path() {
        return $compile_path;
    }

    get directives() {
        return $directives;
    }
}

exports.default = BladeViewCompiler;
//# sourceMappingURL=blade-view-compiler.js.map