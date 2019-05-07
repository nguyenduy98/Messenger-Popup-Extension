window.setTimeout(function () {
  if (app.loadReason === "install" || app.loadReason === "startup") {
    var version = config.welcome.version;
    if (!version) app.tab.open(app.homepage() + "?v=" + app.version() + "&type=install");
    else if (config.welcome.open) {
      if (app.version() !== version) {
        app.tab.open(app.homepage() + "?v=" + app.version() + "&p=" + version + "&type=upgrade");
      }
    }
    config.welcome.version = app.version();
  }
}, 3000);

app.content_script.receive("notifications", function (e) {
  config.count.new = parseInt(e.count);
  if ((config.count.new + '') !== (e.count + '')) return;
  /*  */
  e.count = config.count.new;
  if (e.count !== config.count.old) {
    config.count.old = e.count;
    e.count = e.count <= 0 ? '' : (e.count > 99 ? "99+" : e.count + '');
    app.button.badge = e.count;
  }
});

app.options.receive("changed", function (o) {
  config.set(o.pref, o.value);
  app.options.send("set", {"pref": o.pref, "value": config.get(o.pref)});
  config.badge.update();
});

window.setTimeout(function () {config.badge.update()}, 300);
app.popup.receive("load", function () {app.popup.send("load", {"url": config.facebook.url})});
app.options.receive("get", function (pref) {app.options.send("set", {"pref": pref, "value": config.get(pref)})});
app.popup.receive("resize", function () {app.popup.send("resize", {"width": config.popup.width, "height": config.popup.height})});
