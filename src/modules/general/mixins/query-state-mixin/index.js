import { dedupingMixin } from '@tjmonsi/element-lite/lib/deduping-mixin.js';
import { ErrorMixin } from '../error-mixin/index.js';
import { subscribe, unsubscribe } from '../../../../utils/state.js';

export const QueryStateMixin = dedupingMixin(base => {
  class QueryStateMixin extends /** @type {HTMLElement} */ ErrorMixin(base) {
    constructor () {
      super();
      this._boundGetQueryState = this._getQueryState.bind(this);
    }

    connectedCallback () {
      if (super.connectedCallback) super.connectedCallback();
      subscribe('query', this._boundGetQueryState);
    }

    disconnectedCallback () {
      if (super.disconnectedCallback) super.disconnectedCallback();
      unsubscribe('query', this._boundGetQueryState);
    }

    _getQueryState () {} // overwrite
  }

  return QueryStateMixin;
});
