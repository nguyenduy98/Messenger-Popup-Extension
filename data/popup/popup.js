var background = (function () {
  var _tmp = {};
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    for (var id in _tmp) {
      if (_tmp[id] && (typeof _tmp[id] === "function")) {
        if (request.path === 'background-to-popup') {
          if (request.method === id) _tmp[id](request.data);
        }
      }
    }
  });
  /*  */
  return {
    "receive": function (id, callback) {_tmp[id] = callback},
    "send": function (id, data) {chrome.runtime.sendMessage({"path": 'popup-to-background', "method": id, "data": data})}
  }
})();

var load = function () {
  background.send("load");
  background.send("resize");
  window.removeEventListener("load", load, false);
};

background.receive("load", function (o) {
  var iframe = document.getElementById("popup-iframe");
  if (iframe.src.indexOf("about:blank") === 0) iframe.src = o.url;
});

background.receive("resize", function (o) {
  var iframe = document.getElementById("popup-iframe");
  /*  */
  iframe.setAttribute("width", o.width);
  iframe.setAttribute("height", o.height);
  document.body.style.width = o.width + "px";
  document.documentElement.style.width = o.width + "px";
  if (navigator.userAgent.indexOf("Firefox") === -1) {
    document.body.style.height = o.height + "px";
    document.documentElement.style.height = o.height + "px";
  }
});

window.addEventListener("load", load, false);
var port = chrome.runtime.connect({"name": "POPUP"});
