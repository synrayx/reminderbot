class Hooks {
 constructor() {
 this._handlers = new Map();
 }

 on(event, fn) {
 if (!this._handlers.has(event)) this._handlers.set(event, []);
 this._handlers.get(event).push(fn);
 return this;
 }

 off(event, fn) {
 const list = this._handlers.get(event) || [];
 const idx = list.indexOf(fn);
 if (idx >= 0) list.splice(idx, 1);
 }

 async fire(event, payload = {}) {
 const list = this._handlers.get(event) || [];
 for (const fn of list) {
 await fn(payload);
 }
 }

 names() {
 return [...this._handlers.keys()];
 }
}

const hooks = new Hooks();

module.exports = { Hooks, hooks };