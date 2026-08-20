const crypto = require('node:crypto');

function slugify(text) {
 return String(text)
 .toLowerCase()
 .trim()
 .replace(/[^a-z0-9]+/g, '-')
 .replace(/^-+|-+$/g, '');
}

function shortId(bytes = 6) {
 return crypto.randomBytes(bytes).toString('hex');
}

function parseJson(text, fallback = null) {
 try {
 return JSON.parse(text);
 } catch (e) {
 return fallback;
 }
}

function retry(fn, { attempts = 3, delayMs = 200, backoff = 2 } = {}) {
 return async (...args) => {
 let lastErr;
 for (let i = 0; i < attempts; i++) {
 try {
 return await fn(...args);
 } catch (err) {
 lastErr = err;
 if (i < attempts - 1) {
 await new Promise((r) => setTimeout(r, delayMs * Math.pow(backoff, i)));
 }
 }
 }
 throw lastErr;
 };
}

function clamp(value, min, max) {
 return Math.min(max, Math.max(min, value));
}

function truncate(text, length = 80) {
 if (text.length <= length) return text;
 return text.slice(0, length - 3) + '...';
}

module.exports = { slugify, shortId, parseJson, retry, clamp, truncate };