class Metrics {
 constructor() {
 this.counters = new Map();
 this.gauges = new Map();
 this.timers = new Map();
 }

 incr(name, by = 1) {
 this.counters.set(name, (this.counters.get(name) || 0) + by);
 }

 gauge(name, value) {
 this.gauges.set(name, value);
 }

 time(name, ms) {
 const list = this.timers.get(name) || [];
 list.push(ms);
 this.timers.set(name, list.slice(-1000));
 }

 timer(name, fn) {
 const start = process.hrtime.bigint();
 const result = fn();
 if (result && typeof result.then === 'function') {
 return result.finally(() => {
 const ms = Number(process.hrtime.bigint() - start) / 1e6;
 this.time(name, ms);
 });
 }
 const ms = Number(process.hrtime.bigint() - start) / 1e6;
 this.time(name, ms);
 return result;
 }

 snapshot() {
 const out = {};
 for (const [name, value] of this.counters) out['counter_' + name] = value;
 for (const [name, value] of this.gauges) out['gauge_' + name] = value;
 for (const [name, list] of this.timers) {
 if (!list.length) continue;
 const sorted = [...list].sort((a, b) => a - b);
 out['timer_' + name + '_p50'] = sorted[Math.floor(sorted.length / 2)];
 out['timer_' + name + '_max'] = sorted[sorted.length - 1];
 }
 return out;
 }
}

module.exports = { Metrics };