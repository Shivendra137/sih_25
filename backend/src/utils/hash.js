const crypto = require('crypto');
function canonicalize(obj) {
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(canonicalize).join(',') + ']';
  return '{' + Object.keys(obj).sort().map(k => JSON.stringify(k) + ':' + canonicalize(obj[k])).join(',') + '}';
}
function sha256HexFromBuffer(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}
function sha256HexFromString(str) {
  return sha256HexFromBuffer(Buffer.from(str, 'utf8'));
}
function reportHashHex(reportObject) {
  const canonical = canonicalize(reportObject);
  return sha256HexFromString(canonical);
}
module.exports = { canonicalize, reportHashHex, sha256HexFromString };
