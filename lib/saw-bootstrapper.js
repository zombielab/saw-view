"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sawView = require("saw-view");

var _sawView2 = _interopRequireDefault(_sawView);

var _sawConfig = require("saw-config");

var _sawConfig2 = _interopRequireDefault(_sawConfig);

var _fileViewFinder = require("./finder/file-view-finder");

var _fileViewFinder2 = _interopRequireDefault(_fileViewFinder);

var _viewEngineResolver = require("./engines/view-engine-resolver");

var _viewEngineResolver2 = _interopRequireDefault(_viewEngineResolver);

var _htmlViewEngine = require("./engines/html-view-engine");

var _htmlViewEngine2 = _interopRequireDefault(_htmlViewEngine);

var _compilerViewEngine = require("./engines/compiler-view-engine");

var _compilerViewEngine2 = _interopRequireDefault(_compilerViewEngine);

var _bladeViewCompiler = require("./compilers/blade-view-compiler");

var _bladeViewCompiler2 = _interopRequireDefault(_bladeViewCompiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Bootstrapper {
    static bootstrap(app) {
        _sawView2.default.finder = new _fileViewFinder2.default();

        var paths = _sawConfig2.default.get("view.paths", []);

        for (var path of paths) {
            _sawView2.default.finder.paths.push(path);
        }

        _sawView2.default.finder.extensions.push("html");
        _sawView2.default.finder.extensions.push("blade.html");

        _sawView2.default.engine_resolver = new _viewEngineResolver2.default();
        _sawView2.default.engine_resolver.engines["html"] = new _htmlViewEngine2.default();

        var compiler = new _bladeViewCompiler2.default(_sawConfig2.default.get("view.compiled"));
        _sawView2.default.engine_resolver.engines["blade"] = new _compilerViewEngine2.default(_sawView2.default, compiler);

        _sawView2.default.extensions["html"] = "html";
        _sawView2.default.extensions["blade.html"] = "blade";
    }
}

exports.default = Bootstrapper;
//# sourceMappingURL=saw-bootstrapper.js.map