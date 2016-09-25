"use strict";

class ViewCompiler {
    async isExpired(path) {
        throw new Error("You must override this method.");
    }

    compiled(path) {
        throw new Error("You must override this method.");
    }

    async compile(path) {
        throw new Error("You must override this method.");
    }
}

export default ViewCompiler;