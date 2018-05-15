import Api from './api.js';
import Model from './model.js';
import View from './view.js';
import Controller from './controller.js';

(async () => {
  let api = new Api();
  let model = new Model(api);
  let view = new View(hljs);
  let controller = new Controller(model, view);
  controller.initialise();
})();
