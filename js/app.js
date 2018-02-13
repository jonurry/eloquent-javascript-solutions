var myCodeMirror = CodeMirror(document.body, {
  value: "function myScript(){return 100;}\n",
  mode: "javascript"
});

function renderGists(gists) {
  for (let gist of gists) {
    document.write("<p>" + gist.id + "</p>");
    console.log(gist.comments_url);
  }
}

fetch("https://api.github.com/users/jonurry/gists")
  .then(resp => resp.json()) // Transform response data to json
  .then(function(data) {
    // Here you get the data to modify as you please
    renderGists(data);
  })
  .catch(function(error) {
    // If there is any error you will catch them here
    console.log(error);
  });
