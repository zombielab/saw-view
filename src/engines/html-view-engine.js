"use strict";

import fs from "fs";
import ViewEngine from "./view-engine";

class HtmlViewEngine extends ViewEngine {
    async get(path, data = {}) {
        return await new Promise((resolve, reject) => {
            fs.readFile(path, "utf-8", (error, content) => {
                if (error) {
                    reject(error);
                }

                resolve(content);
            });
        });
    }
}

export default HtmlViewEngine;