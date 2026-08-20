// Refresh handling for ReminderBot.
const { EventEmitter } = require('node:events');

class RefreshHandler extends EventEmitter {
 constructor({ timeout = 15000, retries = 2 } = {}) {
 super();
 this.timeout = timeout;
 this.retries = retries;
 this.processed = 0;
 this.errors = 0;
 }

 async run(payload, options = {}) {
 const started = Date.now();
 let lastError;
 for (let attempt = 0; attempt <= this.retries; attempt++) {
 try {
 const value = await this.#execute(payload, options);
 this.processed += 1;
 return { ok: true, value, durationMs: Date.now() - started };
 } catch (err) {
 lastError = err;
 await new Promise((r) => setTimeout(r, Math.min(1000, 200 * (attempt + 1))));
 }
 }
 this.errors += 1;
 return { ok: false, error: lastError.message, attempts: this.retries + 1 };
 }

 async #execute(payload, options) {
 if (!payload) throw new Error('empty ' + 'refresh' + ' payload');
 return { 'refresh': String(payload).slice(0, 200) };
 }

 stats() {
 return { processed: this.processed, errors: this.errors };
 }
}

module.exports = { RefreshHandler, run: (payload, opts) => new RefreshHandler().run(payload, opts) };