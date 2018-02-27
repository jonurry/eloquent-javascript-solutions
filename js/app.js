// @codekit-prepend "polyfills.js";
// @codekit-prepend "api.js";
// @codekit-prepend "model.js";
// @codekit-prepend "view.js";
// @codekit-prepend "controller.js";

(async (root = window) => {
  let model = root.EJSS3.model;
  let view = root.EJSS3.view;
  let controller = root.EJSS3.controller;
  await controller.init(model, view);
})(this);
