import { dedupingMixin } from '@tjmonsi/element-lite/lib/deduping-mixin.js';
import { ErrorMixin } from '../error-mixin/index.js';
import { subscribe, unsubscribe } from '../../../../utils/state.js';

export const ParamsStateMixin = dedupingMixin(base => {
  class ParamsStateMixin extends /** @type {HTMLElement} */ ErrorMixin(base) {
    constructor () {
      super();
      this._boundGetParamsState = this._getParamsState.bind(this);
    }

    connectedCallback () {
      if (super.connectedCallback) super.connectedCallback();
      subscribe('params', this._boundGetParamsState);
    }

    disconnectedCallback () {
      if (super.disconnectedCallback) super.disconnectedCallback();
      unsubscribe('params', this._boundGetParamsState);
    }

    _getParamsState () {} // overwrite
  }

  return ParamsStateMixin;
});
