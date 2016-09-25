"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _view = require("./view");

var _view2 = _interopRequireDefault(_view);

var _viewFinder = require("./finder/view-finder");

var _viewFinder2 = _interopRequireDefault(_viewFinder);

var _viewEngineResolver = require("./engines/view-engine-resolver");

var _viewEngineResolver2 = _interopRequireDefault(_viewEngineResolver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $engine_resolver,
    $finder,
    $extensions = {},
    $sections = {},
    $shared = {};

class ViewFactory {
    exists(view) {
        return (0, _asyncToGenerator3.default)(function* () {
            try {
                yield $finder.find(view);
            } catch (error) {
                return false;
            }

            return true;
        })();
    }

    make(view, data = {}) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            var path = yield $finder.find(view);
            var extension = path.substr(path.indexOf(".") + 1);

            if (typeof $extensions[extension] === "undefined") {
                throw new TypeError(`Unrecognized extension in file [${ path }].`);
            }

            var engine = $engine_resolver.resolve($extensions[extension]);

            return new _view2.default(_this, engine, view, path, data);
        })();
    }

    render(view, data = {}) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            var $view = yield _this2.make(view, data);

            return yield $view.render();
        })();
    }

    inject(section, content) {
        if (typeof $sections[section] !== "undefined") {
            content = $sections[section].replace("((--- parent ---))", content);
        }

        $sections[section] = content;
    }

    prepend(section, content) {
        if (typeof $sections[section] === "undefined") {
            $sections[section] = "";
        }

        $sections[section] = content + $sections[section];
    }

    append(section, content) {
        if (typeof $sections[section] === "undefined") {
            $sections[section] = "";
        }

        $sections[section] = $sections[section] + content;
    }

    yield(section, defaultContent = "", flush = true) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            var sectionContent = defaultContent;

            if (typeof $sections[section] !== "undefined") {
                sectionContent = $sections[section];
            }

            sectionContent = sectionContent.replace("((--- parent ---))", "");

            sectionContent = sectionContent.replace("((--- parent-holder ---))", "((--- parent ---))");

            // TODO: event emit

            if (flush === true) {
                _this3.flush(section);
            }

            return sectionContent;
        })();
    }

    flush(section) {
        if (typeof section !== "undefined") {
            delete $sections[section];
        }

        $sections = {};
    }

    share(key, value) {
        $shared[key] = value;
    }

    get extensions() {
        return $extensions;
    }

    get engine_resolver() {
        return $engine_resolver;
    }

    set engine_resolver(resolver) {
        if (!resolver instanceof _viewEngineResolver2.default) {
            throw new Error("Engine must be an instance of EngineResolver");
        }

        $engine_resolver = resolver;
    }

    get finder() {
        return $finder;
    }

    set finder(finder) {
        if (!finder instanceof _viewFinder2.default) {
            throw new Error("Finder must be an instance of ViewFinder");
        }

        $finder = finder;
    }

    get sections() {
        return $sections;
    }

    get shared() {
        return $shared;
    }
}

exports.default = ViewFactory;
//# sourceMappingURL=factory.js.map