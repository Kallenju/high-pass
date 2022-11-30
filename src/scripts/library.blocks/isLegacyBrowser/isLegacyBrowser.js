"use strict";

function supportsES6() {
  try {
    new Function("(a = 0) => a");
    return true;
  } catch (err) {
    return false;
  }
}

var mainJS = document.createElement('script');

if (!supportsES6()) {
  var mainStyles = document.head.querySelector('link[href="./styles/style.css"]');

  mainStyles.setAttribute('href', './styles/styleLegacy.css');

  mainJS.setAttribute('src', './scripts/legacy.js');

  window.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(mainJS);
  });
} else {
  mainJS.setAttribute('src', './scripts/modern.js');
  mainJS.setAttribute('defer', '');

  window.addEventListener('DOMContentLoaded', function () {
    document.head.append(mainJS);
  });
}


