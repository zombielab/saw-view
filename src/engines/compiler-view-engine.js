"use strict";

import fs from "fs";
import vm from "vm";
import helpers from "saw-support/helpers";
import ViewEngine from "./view-engine";

var $factory,
    $compiler;

async function evaluate(factory, compiled, data) {
    var sandbox = data;
    sandbox["$factory"] = factory;
    sandbox["$async"] = helpers.async;
    sandbox["$defined_vars"] = data;

    return await vm.runInNewContext(compiled, sandbox, {displayErrors: true});
}

async function evaluateCompiled(path, compiled, data) {
    try {
        var evaluated = await evaluate($factory, compiled, data);
    } catch (error) {
        error.message = `Compiled view [${path}] throws "${error.message}".`;

        throw error;
    }

    return evaluated;
}

async function compiledContent(path) {
    return await new Promise((resolve, reject) => {
        fs.readFile(path, "utf-8", (error, compiled) => {
            if (error) {
                reject(error);
            }

            resolve(compiled);
        });
    });
}

class CompilerViewEngine extends ViewEngine {
    constructor(factory, compiler) {
        super();

        $factory = factory;
        $compiler = compiler;
    }

    async get(path, data = {}) {
        var compiledPath = $compiler.compiled(path);
        var expired = await $compiler.isExpired(path);
        var compiled = expired === true ? await $compiler.compile(path) : await compiledContent(compiledPath);

        return await evaluateCompiled(compiledPath, compiled, data);
    }
}

export default CompilerViewEngine;