const fs = require('node:fs');
const path = require('node:path');

class JsonStorage {
 constructor(file) {
 this.file = file;
 this.data = this.#load();
 }

 #load() {
 try {
 if (fs.existsSync(this.file)) {
 return JSON.parse(fs.readFileSync(this.file, 'utf8'));
 }
 } catch (e) {
 // corrupted file: start fresh
 }
 return {};
 }

 #save() {
 fs.mkdirSync(path.dirname(this.file), { recursive: true });
 const tmp = this.file + '.tmp';
 fs.writeFileSync(tmp, JSON.stringify(this.data, null, 2));
 fs.renameSync(tmp, this.file);
 }

 get(key) {
 return this.data[key];
 }

 set(key, value) {
 this.data[key] = value;
 this.#save();
 return value;
 }

 update(key, patch) {
 const current = this.data[key] || {};
 this.data[key] = { ...current, ...patch };
 this.#save();
 return this.data[key];
 }

 delete(key) {
 const existed = key in this.data;
 delete this.data[key];
 if (existed) this.#save();
 return existed;
 }

 list() {
 return Object.entries(this.data).map(([key, value]) => ({ key, value }));
 }

 size() {
 return Object.keys(this.data).length;
 }
}

module.exports = { JsonStorage };