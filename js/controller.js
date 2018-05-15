class Controller {
  constructor(model, view) {
    this.currentChapter = 2;
    this.model = model;
    this.view = view;
  }
  async initialise() {
    await this.model.loadGists();
    await this.view.setupMenu(
      this.model.getGists(),
      this.loadChapter.bind(this)
    );
    await this.loadChapter(this.currentChapter, false);
  }
  async loadChapter(chapter, menuToggle = true) {
    let chapterGists = {};
    this.view.clearSolution();
    this.view.toggleWaiting('on');
    this.view.updateActiveMenuItem(this.currentChapter, chapter);
    if (menuToggle) {
      this.view.toggleMenu();
    }
    chapterGists = await this.model.loadChapter(chapter);
    this.view.renderChapter(chapterGists);
    this.currentChapter = chapter;
    this.view.toggleWaiting('off');
  }
}

export default Controller;
