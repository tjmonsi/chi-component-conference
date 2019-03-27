import localforage from 'localforage';

const localdb = localforage.createInstance({});

async function setItem (key, val) {
  await localdb.setItem(key, val);
}

async function getItem (key) {
  return localdb.getItem(key);
}

async function removeItem (key) {
  await localdb.removeItem(key);
}

export { setItem, getItem, removeItem };
