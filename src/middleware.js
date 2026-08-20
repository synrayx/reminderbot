function withLogger(logger) {
 return (req, res, next) => {
 const start = Date.now();
 const { method, url } = req;
 res.on('finish', () => {
 logger.info(method + ' ' + url, { status: res.statusCode, ms: Date.now() - start });
 });
 next();
 };
}

function withCors(allowed = ['*']) {
 return (req, res, next) => {
 const origin = req.headers.origin;
 if (allowed.includes('*') || allowed.includes(origin)) {
 res.setHeader('Access-Control-Allow-Origin', origin || '*');
 res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
 res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
 }
 if (req.method === 'OPTIONS') {
 res.writeHead(204);
 return res.end();
 }
 next();
 };
}

function withErrorHandler(handle) {
 return (req, res, next) => {
 Promise.resolve(handle(req, res, next)).catch(next);
 };
}

function notFoundHandler(req, res) {
 res.writeHead(404, { 'Content-Type': 'application/json' });
 res.end(JSON.stringify({ error: 'not_found', path: req.url }));
}

function jsonBody() {
 return (req, res, next) => {
 if (req.method !== 'POST' && req.method !== 'PUT') return next();
 let raw = '';
 req.on('data', (c) => (raw += c));
 req.on('end', () => {
 try {
 req.body = raw ? JSON.parse(raw) : {};
 } catch (e) {
 req.body = {};
 }
 next();
 });
 };
}

module.exports = { withLogger, withCors, withErrorHandler, notFoundHandler, jsonBody };