# babel-plugin-import-inspector

> Babel plugin to wrap dynamic imports with [import-inspector](https://github.com/thejameskyle/import-inspector) with metadata about the import

**Input:**

```js
import("./module");
```

**Output: (with all options turned on)**

```js
import path from "path";
import { wrap } from "import-inspector";

const start = Date.now();

wrap(import("./module"), {
  currentModuleFileName: "path/to/file.js",
  importedModulePath: "./module",
  serverSideRequirePath: path.join(__dirname, "./module"),
  webpackRequireWeakId: () => require.resolveWeak("./module"),
  timeToImport: start - Date.now()
});
```

## Options

#### `currentModuleFileName` (default: true)

```js
wrap(import("./module"), {
  currentModuleFileName: "path/to/file.js"
});
```

#### `importedModulePath` (default: true)

```js
wrap(import("./module"), {
  importedModulePath: "./module"
});
```

#### `serverSideRequirePath` (default: false)

```js
import path from 'path';
// ...
wrap(import("./module"), {
  serverSideRequirePath: path.join(__dirname, "./module")
});
```

#### `webpackRequireWeakId` (default: false)

```js
wrap(import("./module"), {
  webpackRequireWeakId: () => require.resolveWeak("./module")
});
```

#### `timeToImport` (default: false)

```js
const start = Date.now();
// ...
wrap(import("./module"), {
  timeToImport: start - Date.now()
});
```
