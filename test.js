'use strict';

const pluginTester = require('babel-plugin-tester');
const createBabylonOptions = require('babylon-options');
const plugin = require('./');

const babelOptions = {
  filename: 'test.js',
  parserOpts: createBabylonOptions({
    stage: 0
  })
};

pluginTester({
  plugin,
  babelOptions,
  snapshot: true,
  tests: {
    'defaults': { code: 'import("./a")' },

    'all true': {
      code: 'import("./a")',
      pluginOptions: {
        currentModuleFileName: true,
        importedModulePath: true,
        serverSideRequirePath: true,
        webpackRequireWeakId: true,
        timeToImport: true
      }
    },

    'currentModuleFileName: false': { code: 'import("./a")', pluginOptions: { currentModuleFileName: false } },
    'currentModuleFileName: true': { code: 'import("./a")', pluginOptions: { currentModuleFileName: true } },

    'importedModulePath: false': { code: 'import("./a")', pluginOptions: { importedModulePath: false } },
    'importedModulePath: true': { code: 'import("./a")', pluginOptions: { importedModulePath: true } },

    'serverSideRequirePath: false': { code: 'import("./a")', pluginOptions: { serverSideRequirePath: false } },
    'serverSideRequirePath: true': { code: 'import("./a")', pluginOptions: { serverSideRequirePath: true } },

    'webpackRequireWeakId: false': { code: 'import("./a")', pluginOptions: { webpackRequireWeakId: false } },
    'webpackRequireWeakId: true': { code: 'import("./a")', pluginOptions: { webpackRequireWeakId: true } },

    'timeToImport: false': { code: 'import("./a")', pluginOptions: { timeToImport: false } },
    'timeToImport: true': { code: 'import("./a")', pluginOptions: { timeToImport: true } },
  }
});
