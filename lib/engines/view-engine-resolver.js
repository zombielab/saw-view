"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _viewEngine = require("./view-engine");

var _viewEngine2 = _interopRequireDefault(_viewEngine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $engines = {};

class ViewEngineResolver {
    resolve(engine) {
        if ($engines[engine] instanceof _viewEngine2.default) {
            return $engines[engine];
        }

        throw new TypeError(`Engine [${ engine }] not found.`);
    }

    get engines() {
        return $engines;
    }
}

exports.default = ViewEngineResolver;
//# sourceMappingURL=view-engine-resolver.js.map