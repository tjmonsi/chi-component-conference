import { dedupingMixin } from '@tjmonsi/element-lite/lib/deduping-mixin.js';
import { ErrorMixin } from '../../../general/mixins/error-mixin/index.js';
import { databaseStreamOff, databaseStream } from '../../../firebase/utils/firebase.js';

export const DatabaseStreamMixin = dedupingMixin(base => {
  class DatabaseStreamMixin extends /** @type {HTMLElement} */ ErrorMixin(base) {
    disconnectStream (path, fn) {
      databaseStreamOff({ path }, fn);
    }

    connectStream (path, ...filterFn) {
      const fn = filterFn[filterFn.length - 1];
      const filters = filterFn[0];
      this.disconnectStream(path, fn);
      databaseStream({ path, filters }, fn, this._boundError);
    }
  }

  return DatabaseStreamMixin;
});
