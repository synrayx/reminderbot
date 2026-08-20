const fs = require('node:fs');
const path = require('node:path');

const DEFAULTS = {
 port: 4000,
 host: '127.0.0.1',
 verbose: false,
 timeout: 30000,
 retries: 3,
 logLevel: 'info',
 dataDir: './data',
 maxItems: 1000
};

function deepMerge(base, extra) {
 const out = { ...base };
 for (const [k, v] of Object.entries(extra || {})) {
 if (v && typeof v === 'object' && !Array.isArray(v) && base[k] && typeof base[k] === 'object') {
 out[k] = deepMerge(base[k], v);
 } else {
 out[k] = v;
 }
 }
 return out;
}

function loadConfig({ file = null, env = true } = {}) {
 let config = { ...DEFAULTS };

 if (file && fs.existsSync(file)) {
 const raw = fs.readFileSync(file, 'utf8');
 config = deepMerge(config, JSON.parse(raw));
 }

 if (env) {
 if (process.env.PORT) config.port = Number(process.env.PORT);
 if (process.env.HOST) config.host = process.env.HOST;
 if (process.env.VERBOSE === '1') config.verbose = true;
 if (process.env.TIMEOUT) config.timeout = Number(process.env.TIMEOUT);
 if (process.env.RETRIES) config.retries = Number(process.env.RETRIES);
 if (process.env.LOG_LEVEL) config.logLevel = process.env.LOG_LEVEL;
 }

 return config;
}

module.exports = { loadConfig, DEFAULTS };