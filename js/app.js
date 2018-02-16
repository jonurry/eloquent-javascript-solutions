const gistsURL = 'https://api.github.com/users/jonurry/gists';

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

async function render() {
  try {
    // get all of my code gists from github
    let gists = await apiGetJson(gistsURL);
    gists.sort((a, b) => {
      if (a.description < b.description) return -1;
      if (a.description > b.description) return 1;
      return 0;
    });
    for (let gist of gists) {
      let e = createCodeElement(gist);
      let codeURL = gist.files[Object.keys(gist.files)[0]].raw_url;
      let code = await apiGetText(codeURL);
      await renderCode(code, e);
      if (gist.comments > 0) {
        let comments = await apiGetJson(gist.comments_url);
        await renderComments(comments, gist.id);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

(async () => {
  await render();
})();
