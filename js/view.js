(function(root = window) {
  function createView() {
    // private
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
        let commentElement = createElement(
          'div',
          comment.id,
          marked(comment.body)
        );
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

    // public
    function clearSolution() {
      let solutionElement = getElementById('solutions');
      renderEmptyElement(solutionElement);
    }

    async function renderChapter(gists) {
      let solutionElement = getElementById('solutions');
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

    async function setupMenu(gists, callback) {
      let chapterRef = 0;
      let menuElement = getElementById('menu');
      menuElement.onclick = toggleMenu;
      for (let gist of gists) {
        let chapter = gist.description.substring(
          0,
          gist.description.indexOf('.')
        );
        if (chapter != chapterRef) {
          let chapterElement = getElementById('nav-chapter-' + chapter);
          chapterElement.classList.remove('inactive');
          chapterElement.onclick = function() {
            callback(chapter);
          };
          chapterRef = chapter;
        }
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

    function updateActiveMenuItem(currentChapter, chapter) {
      if (currentChapter !== chapter) {
        getElementById('nav-chapter-' + currentChapter).classList.remove(
          'active'
        );
        getElementById('nav-chapter-' + chapter).classList.add('active');
      }
    }

    // export public api
    return {
      clearSolution: clearSolution,
      renderChapter: renderChapter,
      setupMenu: setupMenu,
      toggleMenu: toggleMenu,
      toggleWaiting: toggleWaiting,
      updateActiveMenuItem: updateActiveMenuItem
    };
  }

  // Export to root (window in browser)
  if (typeof define === 'function' && define.amd) {
    // requireJS
  } else if (typeof exports === 'object') {
    // Node.js
    module.exports.view = createView;
  } else {
    // in the browser
    root = root || {};
    root.EJSS3 = root.EJSS3 || {};
    root.EJSS3.createView = createView;
  }
})(this);
