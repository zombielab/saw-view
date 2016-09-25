"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let findNamedPathView = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (name) {
        var [namespace, view] = getNamespaceSegments(name);

        return yield findInPaths(view, [$hints[namespace]]);
    });

    return function findNamedPathView(_x) {
        return _ref.apply(this, arguments);
    };
})();

let findInPaths = (() => {
    var _ref2 = (0, _asyncToGenerator3.default)(function* (name, paths) {
        var stack = [],
            viewPaths = paths.slice(),
            viewFiles = getPossibleViewFiles(name);

        while (viewPaths.length > 0) {
            let viewPath = viewPaths.shift();

            while (viewFiles.length > 0) {
                let view = viewPath + "/" + viewFiles.shift();

                stack.push(new _promise2.default(function (resolve, reject) {
                    _fs2.default.stat(view, function (error) {
                        if (error) {
                            reject(error);
                        }

                        resolve(view);
                    });
                }));
            }
        }

        for (var item of stack) {
            try {
                var path = yield item;

                return path;
            } catch (error) {
                continue;
            }

            return path;
        }

        throw new Error(`View [${ name }] not found.`);
    });

    return function findInPaths(_x2, _x3) {
        return _ref2.apply(this, arguments);
    };
})();

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _viewFinder = require("./view-finder");

var _viewFinder2 = _interopRequireDefault(_viewFinder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $views = {},
    $hints = {},
    $paths = [],
    $extensions = [];

function getNamespaceSegments(name) {
    var segments = name.split(_viewFinder2.default.hint_path_delimiter);

    if (segments.length != 2) {
        throw new Error(`View [${ name }] has an invalid name.`);
    }

    if (typeof $hints[segments[0]] === "undefined") {
        throw new Error(`No hint path defined for [${ segments[0] }].`);
    }

    return segments;
}

function getPossibleViewFiles(name) {
    return $extensions.map(extension => {
        return name + "." + extension;
    });
}

class FileViewFinder extends _viewFinder2.default {
    constructor(paths = [], extensions = []) {
        super();

        $paths = paths;
        $extensions = extensions;
    }

    find(name) {
        return (0, _asyncToGenerator3.default)(function* () {
            if (typeof $views[name] !== "undefined") {
                return $views[name];
            }

            if (name.indexOf(_viewFinder2.default.hint_path_delimiter) >= 0) {
                return $views[name] = yield findNamedPathView(name);
            }

            return $views[name] = yield findInPaths(name, $paths);
        })();
    }

    get paths() {
        return $paths;
    }

    get hints() {
        return $hints;
    }

    get extensions() {
        return $extensions;
    }
}

exports.default = FileViewFinder;
//# sourceMappingURL=file-view-finder.js.map