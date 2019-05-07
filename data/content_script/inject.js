var background = (function () {
  var _tmp = {};
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    for (var id in _tmp) {
      if (_tmp[id] && (typeof _tmp[id] === "function")) {
        if (request.path === 'background-to-page') {
          if (request.method === id) _tmp[id](request.data);
        }
      }
    }
  });
  /*  */
  return {
    "receive": function (id, callback) {_tmp[id] = callback},
    "send": function (id, data) {chrome.runtime.sendMessage({"path": 'page-to-background', "method": id, "data": data})}
  }
})();

var interval = null;

var contentLoaded = function () {
  if (interval) window.clearInterval(interval);
  interval = window.setInterval(function () {
    var count = 0;
    var _user = document.querySelectorAll("div[id*='_user:']");
    if (_user && _user.length) {
      for (var i = 0; i < _user.length; i++) {
        if (_user[i]) {
          var _span = _user[i].querySelector("span[class*='_']");
          if (_span) {
            var _weight = window.getComputedStyle(_span, null).getPropertyValue("font-weight");
            if (_weight === "600" || _weight === "700" || _weight === "bold") count++;
          }
        }
      }
      /*  */
      background.send("notifications", {"count": count});
    } else background.send("notifications", {"count": 0});
  }, 3000);
};

document.addEventListener("DOMContentLoaded", contentLoaded, false);
