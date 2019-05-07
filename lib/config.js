var config = {};

config.count = {"old": 0, "new": 0};

config.welcome = {
  set open (val) {app.storage.write("support", val)},
  get version () {return app.storage.read("version")},
  set version (val) {app.storage.write("version", val)},
  get open () {return (app.storage.read("support") !== undefined ? app.storage.read("support") : true)}
};

config.badge = {
  set color (val) {app.storage.write("badge-color", val)},
  get color () {return app.storage.read("badge-color") || "#FF0000"},
  "update": function () {app.button.badgeColor = config.badge.color}
};

config.facebook = {
  set url (val) {app.storage.write("facebook-url", val)},
  get url () {return app.storage.read("facebook-url") || "https://www.messenger.com/"}
};

config.popup = {
  get width () {return +app.storage.read('width') || 750},
  get height () {return +app.storage.read('height') || 500},
  set width (val) {
    val = +val;
    if (val < 570) val = 570;
    if (val > 800) val = 800;
    app.storage.write('width', val);
  },
  set height (val) {
    val = +val;
    if (val < 400) val = 400;
    if (val > 800) val = 800;
    app.storage.write('height', val);
  }
};

config.get = function (name) {return name.split('.').reduce(function (p, c) {return p[c]}, config)};

config.set = function (name, value) {
  function set(name, value, scope) {
    name = name.split('.');
    if (name.length > 1) {set.call((scope || this)[name.shift()], name.join('.'), value)}
    else {this[name[0]] = value}
  }
  set(name, value, config);
};
