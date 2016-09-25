"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let evaluate = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (factory, compiled, data) {
        var sandbox = data;
        sandbox["$factory"] = factory;
        sandbox["$async"] = _helpers2.default.async;
        sandbox["$defined_vars"] = data;

        return yield _vm2.default.runInNewContext(compiled, sandbox, { displayErrors: true });
    });

    return function evaluate(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
})();

let evaluateCompiled = (() => {
    var _ref2 = (0, _asyncToGenerator3.default)(function* (path, compiled, data) {
        try {
            var evaluated = yield evaluate($factory, compiled, data);
        } catch (error) {
            error.message = `Compiled view [${ path }] throws "${ error.message }".`;

            throw error;
        }

        return evaluated;
    });

    return function evaluateCompiled(_x4, _x5, _x6) {
        return _ref2.apply(this, arguments);
    };
})();

let compiledContent = (() => {
    var _ref3 = (0, _asyncToGenerator3.default)(function* (path) {
        return yield new _promise2.default(function (resolve, reject) {
            _fs2.default.readFile(path, "utf-8", function (error, compiled) {
                if (error) {
                    reject(error);
                }

                resolve(compiled);
            });
        });
    });

    return function compiledContent(_x7) {
        return _ref3.apply(this, arguments);
    };
})();

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _vm = require("vm");

var _vm2 = _interopRequireDefault(_vm);

var _helpers = require("saw-support/helpers");

var _helpers2 = _interopRequireDefault(_helpers);

var _viewEngine = require("./view-engine");

var _viewEngine2 = _interopRequireDefault(_viewEngine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $factory, $compiler;

class CompilerViewEngine extends _viewEngine2.default {
    constructor(factory, compiler) {
        super();

        $factory = factory;
        $compiler = compiler;
    }

    get(path, data = {}) {
        return (0, _asyncToGenerator3.default)(function* () {
            var compiledPath = $compiler.compiled(path);
            var expired = yield $compiler.isExpired(path);
            var compiled = expired === true ? yield $compiler.compile(path) : yield compiledContent(compiledPath);

            return yield evaluateCompiled(compiledPath, compiled, data);
        })();
    }
}

exports.default = CompilerViewEngine;
//# sourceMappingURL=compiler-view-engine.js.map