"use strict";

const $hint_path_delimiter = "::";

class ViewFinder {
    async find(view) {
        throw new Error("You must override this method.");
    }

    get paths() {
        throw new Error("You must override this getter.");
    }

    get hints() {
        throw new Error("You must override this getter.");
    }

    static get hint_path_delimiter() {
        return $hint_path_delimiter;
    }
}

export default ViewFinder;