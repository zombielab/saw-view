"use strict";

import factory from "saw-view";
import config from "saw-config";
import FileViewFinder from "./finder/file-view-finder";
import ViewEngineResolver from "./engines/view-engine-resolver";
import HtmlViewEngine from "./engines/html-view-engine";
import CompilerViewEngine from "./engines/compiler-view-engine";
import BladeViewCompiler from "./compilers/blade-view-compiler";

class Bootstrapper {
    static bootstrap(app) {
        factory.finder = new FileViewFinder();

        var paths = config.get("view.paths", []);

        for (var path of paths) {
            factory.finder.paths.push(path);
        }

        factory.finder.extensions.push("html");
        factory.finder.extensions.push("blade.html");

        factory.engine_resolver = new ViewEngineResolver();
        factory.engine_resolver.engines["html"] = new HtmlViewEngine();

        var compiler = new BladeViewCompiler(config.get("view.compiled"));
        factory.engine_resolver.engines["blade"] = new CompilerViewEngine(factory, compiler);

        factory.extensions["html"] = "html";
        factory.extensions["blade.html"] = "blade";
    }
}

export default Bootstrapper;