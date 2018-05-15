const GISTS_URL = 'https://api.github.com/users/jonurry/gists';

class Model {
  constructor(api) {
    this.api = api;
    this.gists = {};
  }
  async loadChapter(chapter) {
    for (let gist of Array.from(this.gists)) {
      if (
        gist.description.substring(0, gist.description.indexOf('.')) == chapter
      ) {
        for (let key of Object.keys(gist.files)) {
          let file = gist.files[key];
          if (!file.hasOwnProperty('raw_code')) {
            file.raw_code = await this.api.getText(file.raw_url);
          }
        }
        if (gist.comments > 0 && !gist.hasOwnProperty('raw_comments')) {
          gist.raw_comments = await this.api.getJson(gist.comments_url);
        }
      }
    }
    return this.gists.filter(
      a => a.description.substring(0, a.description.indexOf('.')) == chapter
    );
  }

  getGists() {
    // return a copy of the gists object
    return JSON.parse(JSON.stringify(this.gists));
  }

  async loadGists() {
    try {
      // get all of my code gists from github
      this.gists = await this.api.getJson(GISTS_URL);
      // only keep gists relating to (Eloquent JavaScript Solutions)
      this.gists = this.gists.filter(a =>
        a.description.includes('(Eloquent JavaScript Solutions)')
      );
      // sort the remaining gists by exercise number
      this.gists.sort((a, b) => {
        if (a.description < b.description) return -1;
        if (a.description > b.description) return 1;
        return 0;
      });
    } catch (error) {
      console.log(error.message);
    }
  }
}

export default Model;
