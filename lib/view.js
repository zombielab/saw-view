"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _weakMap = require("babel-runtime/core-js/weak-map");

var _weakMap2 = _interopRequireDefault(_weakMap);

var _helpers = require("saw-support/lib/helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $factory,
    $engine = new _weakMap2.default(),
    $name = new _weakMap2.default(),
    $path = new _weakMap2.default(),
    $data = new _weakMap2.default();

class View {
    constructor(factory, engine, name, path, data = {}) {
        $factory = factory;
        $engine.set(this, engine);
        $name.set(this, name);
        $path.set(this, path);
        $data.set(this, data);
    }

    render() {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            var data = {};
            (0, _helpers.object_merge)(data, $data.get(_this));
            (0, _helpers.object_merge)(data, $factory.shared);

            try {
                var content = yield $engine.get(_this).get($path.get(_this), data);

                $factory.flush();
            } catch (error) {
                $factory.flush();

                throw error;
            }

            return content;
        })();
    }

    get name() {
        return $name.get(this);
    }

    get path() {
        return $path.get(this);
    }

    get data() {
        return $data.get(this);
    }

    get factory() {
        return $factory;
    }

    get engine() {
        return $engine.get(this);
    }
}

exports.default = View;
//# sourceMappingURL=view.js.map