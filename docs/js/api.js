class Api {
  async getJson(url) {
    return await (await fetch(url)).json();
  }

  async getText(url) {
    return await (await fetch(url)).text();
  }
}

export default Api;
