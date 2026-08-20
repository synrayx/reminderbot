class TokenBucket {
 constructor({ capacity = 60, refillPerSec = 1 } = {}) {
 this.capacity = capacity;
 this.tokens = capacity;
 this.refillPerSec = refillPerSec;
 this.last = Date.now();
 }

 #refill() {
 const now = Date.now();
 const elapsed = (now - this.last) / 1000;
 this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillPerSec);
 this.last = now;
 }

 take(n = 1) {
 this.#refill();
 if (this.tokens >= n) {
 this.tokens -= n;
 return true;
 }
 return false;
 }

 wait(n = 1, timeoutMs = 30000) {
 return new Promise((resolve, reject) => {
 const started = Date.now();
 const tick = () => {
 if (this.take(n)) return resolve(true);
 if (Date.now() - started > timeoutMs) return reject(new Error('rate limit timeout'));
 setTimeout(tick, 100);
 };
 tick();
 });
 }

 stats() {
 return { available: this.tokens, capacity: this.capacity };
 }
}

module.exports = { TokenBucket };