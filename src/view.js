"use strict";

import helpers from "saw-support/helpers";

var $factory,
    $engine = new WeakMap(),
    $name = new WeakMap(),
    $path = new WeakMap(),
    $data = new WeakMap();

class View {
    constructor(factory, engine, name, path, data = {}) {
        $factory = factory;
        $engine.set(this, engine);
        $name.set(this, name);
        $path.set(this, path);
        $data.set(this, data);
    }

    async render() {
        var data = {};
        helpers.object_merge(data, $data.get(this));
        helpers.object_merge(data, $factory.shared);

        try {
            var content = await ($engine.get(this)).get($path.get(this), data);

            $factory.flush();
        } catch (error) {
            $factory.flush();

            throw error;
        }

        return content;
    }

    get name() {
        return $name.get(this);
    }

    get path() {
        return $path.get(this);
    }

    get data() {
        return $data.get(this);
    }

    get factory() {
        return $factory;
    }

    get engine() {
        return $engine.get(this);
    }
}

export default View;