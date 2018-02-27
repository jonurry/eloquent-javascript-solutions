// Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/prepend()/prepend().md
(function(arr) {
  arr.forEach(function(item) {
    if (item.hasOwnProperty('prepend')) {
      return;
    }
    Object.defineProperty(item, 'prepend', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function prepend() {
        var argArr = Array.prototype.slice.call(arguments),
          docFragment = document.createDocumentFragment();

        argArr.forEach(function(argItem) {
          var isNode = argItem instanceof Node;
          docFragment.appendChild(
            isNode ? argItem : document.createTextNode(String(argItem))
          );
        });

        this.insertBefore(docFragment, this.firstChild);
      }
    });
  });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);
