import { dedupingMixin } from '@tjmonsi/element-lite/lib/deduping-mixin.js';
import { PropertiesLite } from '@tjmonsi/element-lite/mixins/properties-lite.js';
import { ErrorMixin } from '../../../general/mixins/error-mixin';
import { subscribe, unsubscribe } from '../../../../utils/state';

export const GetFilteredSearchMixin = dedupingMixin(base => {
  class GetFilteredSearchMixin extends /** @type {HTMLElement} */ PropertiesLite(ErrorMixin(base)) {
    static get properties () {
      return {
        filteredSearch: {
          type: Array,
          value: []
        }
      };
    }

    constructor () {
      super();
      this._boundChangeFilteredSearch = this.changeFilteredSearch.bind(this);
    }

    connectedCallback () {
      if (super.connectedCallback) super.connectedCallback();
      subscribe('filtered-search', this._boundChangeFilteredSearch);
    }

    disconnectedCallback () {
      if (super.disconnectedCallback) super.disconnectedCallback();
      unsubscribe('filtered-search', this._boundChangeFilteredSearch);
    }

    changeFilteredSearch (filteredSearch) {
      this.filteredSearch = filteredSearch;
    }
  }

  return GetFilteredSearchMixin;
});
