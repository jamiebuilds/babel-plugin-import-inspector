'use strict';

module.exports = function({types: t, template}) {
  function currentModuleFileName(path) {
    return t.objectProperty(
      t.identifier('currentModuleFileName'),
      t.stringLiteral(path.hub.file.opts.filename)
    );
  }

  function importedModulePath(path) {
    return t.objectProperty(
      t.identifier('importedModulePath'),
      path.parent.arguments[0]
    );
  }

  const webpackTemplate = template('() => require.resolveWeak(MODULE)');

  function webpackRequireWeakId(path) {
    return t.objectProperty(
      t.identifier('webpackRequireWeakId'),
      webpackTemplate({
        MODULE: path.parent.arguments[0]
      }).expression
    );
  }

  const serverTemplate = template('PATH.join(__dirname, MODULE)');
  const pathId = Symbol('pathId');

  function serverSideRequirePath(path) {
    if (!path.hub.file[pathId]) {
      path.hub.file[pathId] = path.hub.file.addImport('path', 'default', 'path');
    }

    return t.objectProperty(
      t.identifier('serverSideRequirePath'),
      serverTemplate({
        PATH: path.hub.file[pathId],
        MODULE: path.parent.arguments[0]
      }).expression
    );
  }

  const timeStartTemplate = template('const START = Date.now()');
  const timeStartId = Symbol('timeStartId');

  function addTimeStart(path) {
    const program = path.hub.file.path;
    path.hub.file[timeStartId] = program.scope.generateUidIdentifier('start');
    program.unshiftContainer(
      'body',
      timeStartTemplate({
        START: path.hub.file[timeStartId]
      })
    );
  }

  const timeToImportTemplate = template('START - Date.now()');

  function timeToImport(path) {
    if (!path.hub.file[timeStartId]) addTimeStart(path);

    return t.objectProperty(
      t.identifier('timeToImport'),
      timeToImportTemplate({
        START: path.hub.file[timeStartId]
      }).expression
    );
  }

  const visited = Symbol('visited');
  const reportId = Symbol('reportId');

  return {
    name: 'import-inspector',
    visitor: {
      Import(path) {
        if (path[visited]) return;

        path[visited] = true;

        let opts = Object.assign({
          currentModuleFileName: true,
          importedModulePath: true,
          serverSideRequirePath: false,
          webpackRequireWeakId: false,
          timeToImport: false
        }, this.opts);

        if (!path.hub.file[reportId]) {
          path.hub.file[reportId] = path.hub.file.addImport('import-inspector', 'report');
        }

        let props = [];

        if (opts.currentModuleFileName) props.push(currentModuleFileName(path));
        if (opts.importedModulePath) props.push(importedModulePath(path));
        if (opts.serverSideRequirePath) props.push(serverSideRequirePath(path));
        if (opts.webpackRequireWeakId) props.push(webpackRequireWeakId(path));
        if (opts.timeToImport) props.push(timeToImport(path));

        path.parentPath.replaceWith(
          t.callExpression(path.hub.file[reportId], [
            path.parent,
            t.objectExpression(props)
          ])
        );
      }
    }
  };
};
