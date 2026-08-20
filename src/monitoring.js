class Monitor {
 constructor({ windowMs = 300000 } = {}) {
 this.windowMs = windowMs;
 this.events = [];
 this.started = Date.now();
 }

 record(name, durationMs = null, ok = true) {
 this.events.push({ name, at: Date.now(), durationMs, ok });
 if (this.events.length > 10000) this.events.shift();
 }

 uptimeMs() {
 return Date.now() - this.started;
 }

 snapshot() {
 const cutoff = Date.now() - this.windowMs;
 const recent = this.events.filter((e) => e.at >= cutoff);
 const byName = {};
 for (const e of recent) {
 byName[e.name] = byName[e.name] || { count: 0, totalMs: 0, failures: 0 };
 byName[e.name].count += 1;
 if (e.durationMs !== null) byName[e.name].totalMs += e.durationMs;
 if (!e.ok) byName[e.name].failures += 1;
 }
 const out = {};
 for (const [name, stat] of Object.entries(byName)) {
 out[name] = {
 count: stat.count,
 failures: stat.failures,
 avgMs: stat.count ? Math.round(stat.totalMs / stat.count) : null
 };
 }
 return { uptimeMs: this.uptimeMs(), windowMs: this.windowMs, calls: recent.length, byName: out };
 }
}

module.exports = { Monitor };