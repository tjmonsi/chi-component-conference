import { dedupingMixin } from '@tjmonsi/element-lite/lib/deduping-mixin.js';
import { PropertiesLite } from '@tjmonsi/element-lite/mixins/properties-lite.js';
import { ErrorMixin } from '../../../general/mixins/error-mixin';
import { subscribe, unsubscribe } from '../../../../utils/state';

export const GetQueryResultsMixin = dedupingMixin(base => {
  class GetQueryResultsMixin extends /** @type {HTMLElement} */ PropertiesLite(ErrorMixin(base)) {
    static get properties () {
      return {
        queryResults: {
          type: Array,
          value: []
        }
      };
    }

    constructor () {
      super();
      this._boundChangeQueryResults = this.changeQueryResults.bind(this);
    }

    connectedCallback () {
      if (super.connectedCallback) super.connectedCallback();
      subscribe('query-results', this._boundChangeQueryResults);
    }

    disconnectedCallback () {
      if (super.disconnectedCallback) super.disconnectedCallback();
      unsubscribe('query-results', this._boundChangeQueryResults);
    }

    changeQueryResults (queryResults) {
      this.queryResults = queryResults;
    }
  }

  return GetQueryResultsMixin;
});
