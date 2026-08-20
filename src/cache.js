class TTLCache {
 constructor({ ttlMs = 300000, maxSize = 1024 } = {}) {
 this.ttlMs = ttlMs;
 this.maxSize = maxSize;
 this.map = new Map();
 }

 get(key) {
 const hit = this.map.get(key);
 if (!hit) return undefined;
 if (Date.now() > hit.expires) {
 this.map.delete(key);
 return undefined;
 }
 return hit.value;
 }

 set(key, value, ttlMs = this.ttlMs) {
 if (this.map.size >= this.maxSize && !this.map.has(key)) {
 this.#evictOne();
 }
 this.map.set(key, { value, expires: Date.now() + ttlMs });
 return value;
 }

 has(key) {
 return this.get(key) !== undefined;
 }

 delete(key) {
 return this.map.delete(key);
 }

 clear() {
 this.map.clear();
 }

 size() {
 return this.map.size;
 }

 #evictOne() {
 let oldest = null;
 for (const [key, entry] of this.map) {
 if (!oldest || entry.expires < oldest.expires) oldest = { key, expires: entry.expires };
 }
 if (oldest) this.map.delete(oldest.key);
 }
}

module.exports = { TTLCache };