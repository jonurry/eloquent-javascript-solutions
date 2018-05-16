class Api {
  async getJson(url) {
    let json = [];
    let response;
    do {
      response = await fetch(url);
      // check the link header to see if there is more data to fetch
      if (response.headers.get('Link')) {
        // retrieve url of next set of data to fetch
        url = response.headers
          .get('Link')
          // RegEx removes '"', '<', '>', characters and white space from header links
          .replace(/["<>\s]/g, '')
          // split header links into an array
          .split(',')
          // reduce to one url for next dataset
          .reduce((a, c) => {
            let parts = c.split(';').reverse();
            // look for the next dataset
            if (parts[0] === 'rel=next') {
              // return url of next dataset
              return parts[1];
            } else {
              // return current accumulated value
              return a;
            }
          }, '');
      } else {
        // no header links so no next url
        url = '';
      }
      // concatenate json response to build full dataset
      json = json.concat(await response.json());
    } while (url !== '');
    return json;
  }

  async getText(url) {
    return await (await fetch(url)).text();
  }
}

export default Api;
