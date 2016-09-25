"use strict";

import fs from "fs";
import ViewFinder from "./view-finder";

var $views = {},
    $hints = {},
    $paths = [],
    $extensions = [];

async function findNamedPathView(name) {
    var [namespace, view] = getNamespaceSegments(name);

    return await findInPaths(view, [$hints[namespace]]);
}

async function findInPaths(name, paths) {
    var stack = [],
        viewPaths = paths.slice(),
        viewFiles = getPossibleViewFiles(name);

    while (viewPaths.length > 0) {
        let viewPath = viewPaths.shift();

        while (viewFiles.length > 0) {
            let view = viewPath + "/" + viewFiles.shift();

            stack.push(new Promise((resolve, reject) => {
                fs.stat(view, (error) => {
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
            var path = await item;

            return path;
        } catch (error) {
            continue;
        }

        return path;
    }

    throw new Error(`View [${name}] not found.`);
}

function getNamespaceSegments(name) {
    var segments = name.split(ViewFinder.hint_path_delimiter);

    if (segments.length != 2) {
        throw new Error(`View [${name}] has an invalid name.`);
    }

    if (typeof $hints[segments[0]] === "undefined") {
        throw new Error(`No hint path defined for [${segments[0]}].`);
    }

    return segments;
}

function getPossibleViewFiles(name) {
    return $extensions.map((extension) => {
        return name + "." + extension;
    });
}

class FileViewFinder extends ViewFinder {
    constructor(paths = [], extensions = []) {
        super();

        $paths = paths;
        $extensions = extensions;
    }

    async find(name) {
        if (typeof $views[name] !== "undefined") {
            return $views[name];
        }

        if (name.indexOf(ViewFinder.hint_path_delimiter) >= 0) {
            return $views[name] = await findNamedPathView(name);
        }

        return $views[name] = await findInPaths(name, $paths);
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

export default FileViewFinder;