function formatBytes(bytes) {
 if (!bytes) return '0 B';
 const units = ['B', 'KB', 'MB', 'GB', 'TB'];
 const i = Math.floor(Math.log(bytes) / Math.log(1024));
 return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + units[i];
}

function formatDuration(ms) {
 if (ms < 1000) return Math.round(ms) + 'ms';
 if (ms < 60000) return (ms / 1000).toFixed(1) + 's';
 return (ms / 60000).toFixed(1) + 'm';
}

function jsonPretty(data) {
 return JSON.stringify(data, null, 2);
}

function pad(value, width = 2) {
 return String(value).padStart(width, '0');
}

function timeStamp(date = new Date()) {
 return (
 date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) +
 ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds())
 );
}

function table(rows, columns = null) {
 if (!rows.length) return '(empty)';
 const keys = columns || Object.keys(rows[0]);
 const widths = keys.map((k) => Math.max(k.length, ...rows.map((r) => String(r[k] ?? '').length)));
 const border = '+-' + widths.map((w) => '-'.repeat(w)).join('-+-') + '-+';
 const header = '| ' + keys.map((k, i) => k.padEnd(widths[i])).join(' | ') + ' |';
 const body = rows.map((r) => '| ' + keys.map((k, i) => String(r[k] ?? '').padEnd(widths[i])).join(' | ') + ' |');
 return [border, header, border, ...body, border].join('\n');
}

module.exports = { formatBytes, formatDuration, jsonPretty, pad, timeStamp, table };