import { dedupingMixin } from '@tjmonsi/element-lite/lib/deduping-mixin.js';
import { PropertiesLite } from '@tjmonsi/element-lite/mixins/properties-lite.js';
import { ErrorMixin } from '../../../general/mixins/error-mixin';
import { subscribe, unsubscribe } from '../../../../utils/state';

export const GetQueryMixin = dedupingMixin(base => {
  class GetQueryMixin extends /** @type {HTMLElement} */ PropertiesLite(ErrorMixin(base)) {
    static get properties () {
      return {
        params: {
          type: Object,
          value: {}
        }
      };
    }

    constructor () {
      super();
      this._boundChangeQuery = this.changeQuery.bind(this);
    }

    connectedCallback () {
      if (super.connectedCallback) super.connectedCallback();
      this.params = {};
      subscribe('query', this._boundChangeQuery);
    }

    disconnectedCallback () {
      if (super.disconnectedCallback) super.disconnectedCallback();
      unsubscribe('query', this._boundChangeQuery);
    }

    changeQuery (query) {
      this.params = query;
    }
  }

  return GetQueryMixin;
});
