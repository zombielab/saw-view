"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const $hint_path_delimiter = "::";

class ViewFinder {
    find(view) {
        return (0, _asyncToGenerator3.default)(function* () {
            throw new Error("You must override this method.");
        })();
    }

    get paths() {
        throw new Error("You must override this getter.");
    }

    get hints() {
        throw new Error("You must override this getter.");
    }

    static get hint_path_delimiter() {
        return $hint_path_delimiter;
    }
}

exports.default = ViewFinder;
//# sourceMappingURL=view-finder.js.map