"use strict";

import View from "./view";
import ViewFinder from "./finder/view-finder";
import EngineResolver from "./engines/view-engine-resolver";

var $engine_resolver,
    $finder,
    $extensions = {},
    $sections = {},
    $shared = {};

class ViewFactory {
    async exists(view) {
        try {
            await $finder.find(view);
        } catch (error) {
            return false;
        }

        return true;
    }

    async make(view, data = {}) {
        var path = await $finder.find(view);
        var extension = path.substr(path.indexOf(".") + 1);

        if (typeof $extensions[extension] === "undefined") {
            throw new TypeError(`Unrecognized extension in file [${path}].`);
        }

        var engine = $engine_resolver.resolve($extensions[extension]);

        return new View(this, engine, view, path, data);
    }

    async render(view, data = {}) {
        var $view = await this.make(view, data);

        return await $view.render();
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

    async yield(section, defaultContent = "", flush = true) {
        var sectionContent = defaultContent;

        if (typeof $sections[section] !== "undefined") {
            sectionContent = $sections[section];
        }

        sectionContent = sectionContent.replace("((--- parent ---))", "");

        sectionContent = sectionContent.replace("((--- parent-holder ---))", "((--- parent ---))");

        // TODO: event emit

        if (flush === true) {
            this.flush(section);
        }

        return sectionContent;
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
        if (!resolver instanceof EngineResolver) {
            throw new Error("Engine must be an instance of EngineResolver");
        }

        $engine_resolver = resolver;
    }

    get finder() {
        return $finder;
    }

    set finder(finder) {
        if (!finder instanceof ViewFinder) {
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

export default ViewFactory;