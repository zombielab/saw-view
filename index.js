"use strict";

// compiled dir/files are meant to be removed as soon as node handle async/await and es2015 modules
// until then we'll do this way.
var ViewFactory = require("./lib/factory");

module.exports = new (ViewFactory.default)();