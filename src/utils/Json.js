const fs = require('fs');
const { type } = require('os');

class Json {

    static validate(data) {
        try {
            return JSON.parse(data);
        } catch (e) {
            throw new Error('Given path is not empty and its content is not valid JSON.');
        }
    }

    static create(path) {
        try {
            fs.writeFileSync(path, "{}")
            return this.check(path);
        } catch (e) {
            throw new Error(`Cannot write file!`);
        }
    }

    static stats(path) {
        try {
            return fs.statSync(path);
        } catch (err) {
            if (err.code === 'EACCES') throw new Error(`Cannot access path "${path}".`);
            else throw new Error(`Error while checking for existence of path "${path}": ${err}`);
        }
    }

    static exists(path) {
        try {
            if (fs.existsSync(path)) return true;
            return this.create(path);
        } catch(err) {
            return this.create(path);
        }
    }

    static access(path) {
        try {
            fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK);
            return true;
        } catch (err) {
            throw new Error(`Cannot read & write on path "${path}". Check permissions!`);
        }
    }

    static read(path) {
        try {
            let buffer = fs.readFileSync(path);
            return this.validate(buffer)
        } catch (err) {
            throw err; // TODO: Do something meaningful
        }
    }

    static check(path) {
        if (!this.exists(path)) return;
        if (this.access(path)) {
            if (this.stats(path).size > 0) return this.read(path);
        }
    }
    
    static write(path, data) {
        try {
            fs.writeFileSync(path, JSON.stringify(data, null, 4));
            return true;
        } catch (error) {
            throw new Error(`Error while writing to path "${path}": ${err}`);
        }
    }

    static expand(object, key, value) {
        var result = object;
        var arr = key.split('.');
        for(var i = 0; i < arr.length-1; i++) {
            var e = arr[i];
            if (typeof object[e] !== 'object') delete object[e];
            object = object[e] = object[e] ? object[e] : {};
        }
        object[arr[arr.length-1]] = value;
        return result;
    }
}

module.exports = Json;