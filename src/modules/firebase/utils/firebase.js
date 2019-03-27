import { configs } from '../../../../configs/firebase.config.js';
import { unsubscribe, subscribe } from '../../../utils/state';
import { firebase } from './loader';
const { fetch } = window;
const firebaseRefs = {};

for (let i in configs) {
  if (i === 'main') {
    firebase.initializeApp(configs[i]);
  }
}

const createFirebaseRef = (dbName, path, filters) => {
  if (firebase) {
    let ref = firebase.database(dbName === 'main' ? null : dbName).ref(path);
    for (let i in filters) {
      if (i === 'orderBy') {
        switch (filters[i]) {
          case '$key':
            ref = ref.orderByKey();
            break;
          case '$value':
            ref = ref.orderByValue();
            break;
          default:
            ref = ref.orderByChild(filters[i]);
        }
      } else {
        ref = ref[i](filters[i]);
      }
    }
    return ref;
  }
};

const createFirebaseRefKey = (dbName = 'main', path, filters) => {
  const filterList = [];
  for (let i in filters) {
    filterList.push(`${i}:${filters[i]}`);
  }
  filterList.sort();
  return `${dbName}.${path}${filterList.length ? `.${filterList.join('--')}` : ''}`;
};

const queryList = [];

const databaseStream = (query, fn, errorFn) => {
  if (!firebase) {
    const checker = (firebaseReady) => {
      if (firebaseReady) {
        while (queryList.length) {
          const { query: q, fn: f, errorFn: err } = queryList.pop();
          databaseStream(q, f, err);
        }

        unsubscribe('firebase-ready', checker);
      }
    };
    queryList.push({
      query,
      fn,
      errorFn
    });
    subscribe('firebase-ready', checker);
  } else {
    const { path, filters, dbName } = query;
    const ref = createFirebaseRef(dbName, path, filters);
    const refKey = createFirebaseRefKey(dbName, path, filters);
    if (refKey) {
      firebaseRefs[refKey] = ref;
      firebaseRefs[refKey].on('value', fn, errorFn);
    }
  }
};

const databaseStreamOff = (query, fn) => {
  const { path, filters, dbName } = query;
  const refKey = createFirebaseRefKey(dbName, path, filters);
  if (firebaseRefs[refKey]) {
    firebaseRefs[refKey].off('value', fn);
  }
};

const databaseGet = async (query) => {
  const { path, filters, dbName } = query;
  if (firebase) {
    const ref = createFirebaseRef(dbName, path, filters);
    const snapshot = await ref.once('value');
    return snapshot.val();
  } else {
    const config = configs[dbName || 'main'];
    let queryParams = [];
    for (let i in filters) {
      queryParams.push(`${i}="${encodeURI(filters[i])}"`);
    }
    const result = await fetch(`${config.databaseURL}/${path}.json?${queryParams.join('&')}`);
    if (result.status > 400) {
      const error = await result.json();
      throw new Error(error.error);
    }
    const data = await result.json();
    return data;
  }
};

export { firebase, databaseGet, databaseStream, databaseStreamOff };
