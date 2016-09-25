# SAW View 

View module for Nodejs >= 6 that also support the lovely Blade templating syntax of Laravel framework.

## Install

```bash
npm install https://github.com/zombielab/saw-view.git
```

## Use

```javascript
// The module is coded with ES6 features and makes the use of Promises.
import view from "saw-view";

// So now you can use async/await (ES7) like that:
var output = await view.render("user/profile", { name: "John Doe" });

// Or 
view.render("user/profile", { name: "John Doe" }).then((content) => {
	// whatever
})
.catch((error) => {
	throw error;
});
```

## Setup

While the module has been designed to be a part of SAW Framework it will work perfectly separated. 
In that case you'll need to setup few things. The following code will do the initial setup, 
so put it anywhere you want in your project.

```javascript
import factory from "saw-view";
import FileViewFinder from "saw-view/lib/finder/file-view-finder";
import ViewEngineResolver from "saw-view/lib/engines/view-engine-resolver";
import HtmlViewEngine from "saw-view/lib/engines/html-view-engine";
import CompilerViewEngine from "saw-view/lib/engines/compiler-view-engine";
import BladeViewCompiler from "saw-view/lib/compilers/blade-view-compiler";

var dir = __dirname + "/resources/views",
    compiled_dir = __dirname + "/resources/views-compiled";

// Registering the view finder and a directory path to look into
factory.finder = new FileViewFinder();
factory.finder.paths.push(dir);

// Adding file extensions.
factory.finder.extensions.push("html");
factory.finder.extensions.push("blade.html");

// And view engines.
// The module comes shipped with an Html and a Blade templating engine.
factory.engine_resolver = new ViewEngineResolver();
factory.engine_resolver.engines["html"] = new HtmlViewEngine();

// For the Blade engine you must also define a directory path where to store compiled views.
var compiler = new BladeViewCompiler(compiled_dir);
factory.engine_resolver.engines["blade"] = new CompilerViewEngine(factory, compiler);

// Associating file extensions with engines.
factory.extensions["html"] = "html";
factory.extensions["blade.html"] = "blade";

// And we're done 
```