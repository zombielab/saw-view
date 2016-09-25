"use strict";

class ViewEngine {
    async get(path, data = {}) {
        throw new Error("You must override this method.");
    }
}

export default ViewEngine;