(function(root = window) {
  async function apiGetJson(url) {
    return await (await fetch(url)).json();
  }

  async function apiGetText(url) {
    return await (await fetch(url)).text();
  }

  let api = {
    getJson: apiGetJson,
    getText: apiGetText
  };

  // Export to root (window in browser)
  if (typeof define === 'function' && define.amd) {
    // requireJS
  } else if (typeof exports === 'object') {
    // Node.js
    module.exports.api = api;
  } else {
    // in the browser
    root = root || {};
    root.EJSS3 = root.EJSS3 || {};
    root.EJSS3.api = api;
  }
})(this);
