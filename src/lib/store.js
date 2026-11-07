const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const seed = require('../../data/seed.json');
const filePath = path.resolve(process.cwd(), process.env.DATA_FILE || 'data/store.json');
function init() {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify(seed, null, 2) + '\n');
}
function read() { init(); return JSON.parse(fs.readFileSync(filePath, 'utf8')); }
function save(state) {
  init();
  const temporary = filePath + '.tmp';
  fs.writeFileSync(temporary, JSON.stringify(state, null, 2) + '\n');
  fs.renameSync(temporary, filePath);
}
function create(collection, input) {
  const state = read(); const now = new Date().toISOString();
  const item = { id: randomUUID(), ...input, createdAt: now, updatedAt: now };
  state[collection].push(item); save(state); return item;
}
function update(collection, id, patch) {
  const state = read(); const item = state[collection].find(x => x.id === id);
  if (!item) return null;
  Object.assign(item, patch, {updatedAt:new Date().toISOString()}); save(state); return item;
}
function remove(collection, id) {
  const state = read(); const index = state[collection].findIndex(x => x.id === id);
  if (index === -1) return null;
  const [removed] = state[collection].splice(index,1); save(state); return removed;
}
module.exports = { read, save, create, update, remove };
