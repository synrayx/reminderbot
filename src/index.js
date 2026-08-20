const { EventEmitter } = require('node:events');

class reminderbotBot extends EventEmitter {
 constructor({ token, debug = false } = {}) {
 super();
 this.token = token;
 this.debug = debug;
 this.handlers = new Map();
 this.started = false;
 }

 onCommand(name, handler) {
 this.handlers.set(name, handler);
 return this;
 }

 start() {
 if (this.started) return this;
 this.started = true;
 this.emit('ready');
 this.#pump();
 return this;
 }

 async #pump() {
 // In production this polls a platform API. Here we simulate events.
 const ticker = setInterval(async () => {
 if (!this.started) return clearInterval(ticker);
 const sample = this.#sample();
 await this.#handle(sample);
 }, 5000);
 }

 #sample() {
 const commands = [...this.handlers.keys()];
 const name = commands[Math.floor(Math.random() * commands.length)] || 'ping';
 return { id: String(Date.now()), user: 'tester', text: '/' + name, at: new Date().toISOString() };
 }

 async #handle(msg) {
 const first = msg.text.split(/\s+/)[0].toLowerCase();
 const handler = this.handlers.get(first.replace(/^\//, ''));
 if (!handler) return;
 this.emit('message', msg);
 if (this.debug) console.log('handled', first);
 try {
 await handler(msg);
 } catch (err) {
 this.emit('error', err);
 }
 }
}

module.exports = { reminderbotBot };