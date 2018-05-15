function appendElement(parent, child) {
  return parent.appendChild(child);
}

function createElement(elementType, id = '', content = '') {
  let element = document.createElement(elementType);
  if (id !== '') {
    element.setAttribute('id', id);
  }
  if (content !== '') {
    element.innerHTML = content;
  }
  return element;
}

function getElementById(id) {
  return document.getElementById(id);
}

function getElementsByTagName(tag) {
  return document.getElementsByTagName(tag);
}

function prependElement(e1, e2) {
  e1.prepend(e2);
}

function renderCode(gistElement, files, hljs) {
  for (let key of Object.keys(files)) {
    let fileElement = createElement(
      'div',
      files[key].filename,
      marked('```js\n' + files[key].raw_code + '\n```')
    );
    appendElement(gistElement, fileElement);
    hljs.highlightBlock(fileElement.firstChild.firstChild);
  }
}

function renderComments(gistElement, comments) {
  let first = true;
  for (let comment of comments) {
    let commentElement = createElement('div', comment.id, marked(comment.body));
    if (first) {
      prependElement(gistElement, commentElement);
      first = false;
    } else {
      appendElement(gistElement, commentElement);
    }
  }
}

function renderEmptyElement(e) {
  e.innerHTML = '';
}

class View {
  constructor(hljs) {
    this.hljs = hljs;
  }

  clearSolution() {
    let solutionElement = getElementById('solutions');
    renderEmptyElement(solutionElement);
  }

  async renderChapter(gists) {
    let solutionElement = getElementById('solutions');
    for (let gist of gists) {
      let gistElement = createElement('div', gist.id);
      appendElement(solutionElement, gistElement);
      renderCode(gistElement, gist.files, this.hljs);
      prependElement(gistElement, createElement('h3', '', 'Solution'));
      if (gist.comments > 0) {
        renderComments(gistElement, gist.raw_comments);
      }
    }
  }

  async setupMenu(gists, callback) {
    let chapterRef = 0;
    let menuElement = getElementById('menu');
    let view = this;
    menuElement.onclick = this.toggleMenu;
    for (let gist of Array.from(gists)) {
      let chapter = gist.description.substring(
        0,
        gist.description.indexOf('.')
      );
      if (chapter != chapterRef) {
        let chapterElement = getElementById('nav-chapter-' + chapter);
        chapterElement.classList.remove('inactive');
        chapterElement.onclick = async () => callback(chapter);
        chapterRef = chapter;
      }
    }
  }

  toggleMenu() {
    getElementsByTagName('nav')[0].classList.toggle('collapsed');
  }

  toggleWaiting(state) {
    if (state === 'on') {
      getElementById('waiting').classList.remove('hidden');
    } else {
      getElementById('waiting').classList.add('hidden');
    }
  }

  updateActiveMenuItem(currentChapter, chapter) {
    if (currentChapter !== chapter) {
      getElementById('nav-chapter-' + currentChapter).classList.remove(
        'active'
      );
      getElementById('nav-chapter-' + chapter).classList.add('active');
    }
  }
}

export default View;
