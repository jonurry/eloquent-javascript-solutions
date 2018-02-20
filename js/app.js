// @codekit-prepend "polyfills.js";

// Globals
const gistsURL = 'https://api.github.com/users/jonurry/gists';
let gists = {};
let currentChapter = 2;

// api
async function apiGetJson(url) {
  return await (await fetch(url)).json();
}

async function apiGetText(url) {
  return await (await fetch(url)).text();
}

// view
function getElementById(id) {
  return document.getElementById(id);
}

function getElementsByTagName(tag) {
  return document.getElementsByTagName(tag);
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

function appendElement(parent, child) {
  return parent.appendChild(child);
}

function prependElement(e1, e2) {
  e1.prepend(e2);
}

function renderEmptyElement(e) {
  e.innerHTML = '';
}

function renderCode(gistElement, files) {
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

function clearSolution() {
  let solutionElement = getElementById('solutions');
  renderEmptyElement(solutionElement);
  return solutionElement;
}

async function renderChapter(gists) {
  let solutionElement = clearSolution();
  for (let gist of gists) {
    let gistElement = createElement('div', gist.id);
    appendElement(solutionElement, gistElement);
    renderCode(gistElement, gist.files);
    prependElement(gistElement, createElement('h3', '', 'Solution'));
    if (gist.comments > 0) {
      renderComments(gistElement, gist.raw_comments);
    }
  }
}

async function enableMenu(gists) {
  let chapterRef = 0;
  for (let gist of gists) {
    let chapter = gist.description.substring(0, gist.description.indexOf('.'));
    if (chapter != chapterRef) {
      let menuElement = getElementById('nav-chapter-' + chapter);
      menuElement.classList.remove('inactive');
      menuElement.onclick = function() {
        loadChapter(chapter);
      };
      chapterRef = chapter;
    }
  }
}

function updateActiveMenuItem(currentChapter, chapter) {
  if (currentChapter !== chapter) {
    getElementById('nav-chapter-' + currentChapter).classList.remove('active');
    getElementById('nav-chapter-' + chapter).classList.add('active');
  }
}

function toggleMenu() {
  getElementsByTagName('nav')[0].classList.toggle('collapsed');
}

function toggleWaiting(state) {
  if (state === 'on') {
    getElementById('waiting').classList.remove('hidden');
  } else {
    getElementById('waiting').classList.add('hidden');
  }
}

// model - load gists
async function getGists(url) {
  try {
    // get all of my code gists from github
    let gists = await apiGetJson(url);
    // only keep gists relating to (Eloquent JavaScript Solutions)
    gists = gists.filter(a =>
      a.description.includes('(Eloquent JavaScript Solutions)')
    );
    // sort the remaining gists by exercise number
    gists.sort((a, b) => {
      if (a.description < b.description) return -1;
      if (a.description > b.description) return 1;
      return 0;
    });
    return gists;
  } catch (error) {
    console.log(error.message);
  }
}

async function loadChapter(chapter, menuToggle = true) {
  toggleWaiting('on');
  clearSolution();
  updateActiveMenuItem(currentChapter, chapter);
  if (menuToggle) {
    toggleMenu();
  }
  await getCodeAndComments(gists, chapter);
  renderChapter(prepareChapterGists(gists, chapter));
  currentChapter = chapter;
  toggleWaiting('off');
}

async function getCodeAndComments(gists, chapter) {
  for (let gist of gists) {
    if (
      gist.description.substring(0, gist.description.indexOf('.')) == chapter
    ) {
      for (let key of Object.keys(gist.files)) {
        let file = gist.files[key];
        if (!file.hasOwnProperty('raw_code')) {
          file.raw_code = await apiGetText(file.raw_url);
        }
      }
      if (gist.comments > 0 && !gist.hasOwnProperty('raw_comments')) {
        gist.raw_comments = await apiGetJson(gist.comments_url);
      }
    }
  }
}

function prepareChapterGists(gists, chapter) {
  return gists.filter(
    a => a.description.substring(0, a.description.indexOf('.')) == chapter
  );
}

// init
(async () => {
  gists = await getGists(gistsURL);
  enableMenu(gists);
  await loadChapter(currentChapter, false);
})();
