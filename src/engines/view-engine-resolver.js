"use strict";

import ViewEngine from "./view-engine";

var $engines = {};

class ViewEngineResolver {
    resolve(engine) {
        if ($engines[engine] instanceof ViewEngine) {
            return $engines[engine];
        }

        throw new TypeError(`Engine [${engine}] not found.`);
    }

    get engines() {
        return $engines;
    }
}

export default ViewEngineResolver;