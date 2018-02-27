(function(root = window) {
  // private
  let currentChapter = 2;
  let model = {};
  let view = {};

  async function loadChapter(chapter, menuToggle = true) {
    let chapterGists = {};
    view.clearSolution();
    view.toggleWaiting('on');
    view.updateActiveMenuItem(currentChapter, chapter);
    if (menuToggle) {
      view.toggleMenu();
    }
    chapterGists = await model.loadChapter(chapter);
    view.renderChapter(chapterGists);
    currentChapter = chapter;
    view.toggleWaiting('off');
  }

  // public
  async function init(appModel, appView) {
    model = appModel;
    view = appView;
    await model.loadGists();
    await view.setupMenu(model.getGists(), loadChapter);
    await loadChapter(currentChapter, false);
  }

  // export public api
  let controller = {
    init: init
  };

  // Export to root (window in browser)
  if (typeof define === 'function' && define.amd) {
    // requireJS
  } else if (typeof exports === 'object') {
    // Node.js
    module.exports.controller = controller;
  } else {
    // in the browser
    root = root || {};
    root.EJSS3 = root.EJSS3 || {};
    root.EJSS3.controller = controller;
  }
})(this);
