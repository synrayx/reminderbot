const fs = require('node:fs');
const path = require('node:path');

const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };

class Logger {
 constructor({ level = 'info', file = null } = {}) {
 this.level = LEVELS[level] ?? 20;
 this.file = file;
 if (file) fs.mkdirSync(path.dirname(file), { recursive: true });
 }

 #write(line) {
 if (this.file) fs.appendFileSync(this.file, line + '\n');
 else process.stderr.write(line + '\n');
 }

 #line(lvl, msg, extra) {
 const ts = new Date().toISOString();
 const suffix = extra ? ' ' + JSON.stringify(extra) : '';
 return '[' + ts + '] ' + lvl.toUpperCase().padEnd(5) + ' reminderbot: ' + msg + suffix;
 }

 log(lvl, msg, extra) {
 if ((LEVELS[lvl] ?? 20) < this.level) return;
 this.#write(this.#line(lvl, msg, extra));
 }

 debug(msg, extra) { this.log('debug', msg, extra); }
 info(msg, extra) { this.log('info', msg, extra); }
 warn(msg, extra) { this.log('warn', msg, extra); }
 error(msg, extra) { this.log('error', msg, extra); }

 child(ns) {
 const self = this;
 return {
 debug: (m, x) => self.debug(ns + ': ' + m, x),
 info: (m, x) => self.info(ns + ': ' + m, x),
 warn: (m, x) => self.warn(ns + ': ' + m, x),
 error: (m, x) => self.error(ns + ': ' + m, x)
 };
 }
}

module.exports = { Logger };