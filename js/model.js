(function(root = window) {
  function createModel(API) {
    // private
    //const API = root.EJSS3.api;
    const GISTS_URL = 'https://api.github.com/users/jonurry/gists';
    let gists = {};

    // public
    async function getChapterGists(chapter) {
      for (let gist of gists) {
        if (
          gist.description.substring(0, gist.description.indexOf('.')) ==
          chapter
        ) {
          for (let key of Object.keys(gist.files)) {
            let file = gist.files[key];
            if (!file.hasOwnProperty('raw_code')) {
              file.raw_code = await API.getText(file.raw_url);
            }
          }
          if (gist.comments > 0 && !gist.hasOwnProperty('raw_comments')) {
            gist.raw_comments = await API.getJson(gist.comments_url);
          }
        }
      }
      return gists.filter(
        a => a.description.substring(0, a.description.indexOf('.')) == chapter
      );
    }

    function getGists() {
      return JSON.parse(JSON.stringify(gists));
    }

    async function loadGists() {
      try {
        // get all of my code gists from github
        gists = await API.getJson(GISTS_URL);
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
      } catch (error) {
        console.log(error.message);
      }
    }

    return {
      getGists: getGists,
      loadChapter: getChapterGists,
      loadGists: loadGists
    };
  }

  // Export to root (window in browser)
  if (typeof define === 'function' && define.amd) {
    // requireJS
  } else if (typeof exports === 'object') {
    // Node.js
    module.exports.model = createModel;
  } else {
    // in the browser
    root = root || {};
    root.EJSS3 = root.EJSS3 || {};
    root.EJSS3.createModel = createModel;
  }
})(this);
