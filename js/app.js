const gistsURL = 'https://api.github.com/users/jonurry/gists';
let gists = {};
let currentChapter = 2;

function createCodeElement(gist) {
  let solutionsElement = document.getElementById('solutions');
  let newElement = solutionsElement.appendChild(document.createElement('div'));
  newElement.setAttribute('id', gist.id);
  return newElement;
}

async function apiGetJson(url) {
  return await (await fetch(url)).json();
}

async function apiGetText(url) {
  return await (await fetch(url)).text();
}

async function renderCode(code, element) {
  element.innerHTML = marked('```js\n' + code + '\n```');
  hljs.highlightBlock(element.firstChild.firstChild);
  let h2 = document.createElement('h3');
  h2.innerHTML = 'Solution';
  element.prepend(h2);
}

async function renderComments(comments, id) {
  let first = true;
  for (let comment of comments) {
    let commentElement;
    let gistElement = document.getElementById(id);
    if (first) {
      gistElement.prepend(document.createElement('div'));
      commentElement = gistElement.firstChild;
      first = false;
    } else {
      commentElement = gistElement.appendChild(document.createElement('div'));
    }
    commentElement.setAttribute('id', comment.id);
    commentElement.innerHTML = marked(comment.body);
  }
}

async function renderChapter(chapter, menuToggle = true) {
  document.getElementById('solutions').innerHTML = '';
  let chapterGists = gists.filter(a => 
    a.description.substring(0, a.description.indexOf('.')) == chapter
  );
  for (let gist of chapterGists) {
    let e = createCodeElement(gist);
    let codeURL = gist.files[Object.keys(gist.files)[0]].raw_url;
    let code = await apiGetText(codeURL);
    await renderCode(code, e);
    if (gist.comments > 0) {
      let comments = await apiGetJson(gist.comments_url);
      await renderComments(comments, gist.id);
    }
  }
  if (currentChapter !== chapter) {
    document.getElementById('nav-chapter-' + currentChapter).classList.remove('active');
    document.getElementById('nav-chapter-' + chapter).classList.add('active');
    currentChapter = chapter;
  }
  if (menuToggle) {
    toggleMenu();
  };
}

async function enableChaptersMenu() {
  let chapterRef = 0;
  for (let gist of gists) {
    let chapter = gist.description.substring(0, gist.description.indexOf('.'));
    if (chapter != chapterRef) {
      let menuElement = document.getElementById('nav-chapter-' + chapter);
      menuElement.classList.remove('inactive');
      menuElement.onclick = function() {renderChapter(chapter);};
      chapterRef = chapter;
    }
  }
}

async function render() {
  try {
    // get all of my code gists from github
    gists = await apiGetJson(gistsURL);
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
    enableChaptersMenu();
    renderChapter(currentChapter, false);
  } catch (error) {
    console.log(error.message);
  }
}

(async () => {
  await render();
})();

function toggleMenu() {
  document.getElementsByTagName('nav')[0].classList.toggle('collapsed');
}