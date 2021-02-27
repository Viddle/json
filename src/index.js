const Json = require('./utils/Json');
const fs = require('fs');

class DataBase {
    constructor(path = "db", options = { refresh: false }) {
        this.storage = {};
        this.path = `${path}.json`;
        this.stats = {};
        this.options = options;
        this.init();
    }

    init() {
        this.storage = Json.check(this.path);
    }

    set(key, value, json = true) {
        key = (key).toString();
        if (json && key.indexOf('.') !== -1) this.storage = Json.expand(this.storage, key, value);
        else this.storage[key] = value;
        this.sync();
        return true;
    }
    
    delete(key, json = true) {
        var status = true;
        if (json && key.indexOf(".") !== -1) {
            let keys = key.split('.');
            status = keys.reduce(function(o, k) {
                if (!o || !o[k]) return undefined
                if (keys.indexOf(k) == keys.length - 1) return delete o[k];
                return o[(k).toString()]
            }, this.storage);
        }
        else delete this.storage[key];
        this.sync();
        return status;
    }

    get(key, json = true) {
        if (this.options.refresh) this.refresh();
        if (json && key.indexOf(".") > -1) return key.split('.').reduce(function(o, k) { return o[k] }, this.storage);
        return this.storage[key] || undefined;
    }
    
    all() {
        return this.storage;
    }

    refresh() {
        return this.storage = Json.read(this.path);
    }

    sync() {
        return Json.write(this.path, this.storage);
    }
}

module.exports = DataBase;