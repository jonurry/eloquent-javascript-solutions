// @codekit-prepend "polyfills.js";
// @codekit-prepend "api.js";
// @codekit-prepend "model.js";
// @codekit-prepend "view.js";
// @codekit-prepend "controller.js";

(async (root = window) => {
  let api = root.EJSS3.createAPI();
  let model = root.EJSS3.createModel(api);
  let view = root.EJSS3.createView();
  let controller = root.EJSS3.createController();
  await controller.init(model, view);
})(this);
