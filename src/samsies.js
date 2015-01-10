"use strict";

module.exports = function() {
  var that = this;

  var listeners = {},
      data      = {};

  //
  // Subscribes a function to an event called by fire
  //
  that.prototype.on = function on(type, callback, data, once) {
    if (!listeners[type]) {
      listeners[type] = [];
    }

    listeners[type].push(arguments);
  };

  //
  // Just like on but it unsubscribes after one fire
  //
  that.prototype.once = function once(type, callback, data) {
    return that.on.apply(that, [
      arguments[0],
      arguments[1],
      arguments[2],
      true
    ]);
  };

  //
  // Fire an event and run all subscribers
  //
  that.prototype.fire = function fire(type, data) {
    if(listeners[type]) {
      listeners[type].forEach(function(listener) {
        listener[1]({
          listener : listener[2],
          caller   : data
        });
      });

      listeners[type] = listeners[type].filter(function(p) {return !p[3];});
    }
  };

  //
  // Gets a value by key
  //
  that.prototype.get = function get(key) {

    that.fire("get:" + key, {
      "value" : data[key]
    });

    that.fire("get", {
      "value" : data[key],
      "key"   : key
    });

    return data[key];

  };

  //
  // Sets a value by key
  //
  that.prototype.get = function get(key, value) {

    var old = data[key];

    data[key] = value;

    that.fire("set:" + key, {
      "value" : data[key]
    });

    that.fire("set", {
      "value"    : data[key],
      "oldValue" : old,
      "key"      : key
    });

    return data[key];

  };
};