import { dedupingMixin } from '@tjmonsi/element-lite/lib/deduping-mixin.js';
import { PropertiesLite } from '@tjmonsi/element-lite/mixins/properties-lite.js';
import { ErrorMixin } from '../../../general/mixins/error-mixin';
import { subscribe, unsubscribe } from '../../../../utils/state';

export const GetFilteredVenuesMixin = dedupingMixin(base => {
  class GetFilteredVenuesMixin extends /** @type {HTMLElement} */ PropertiesLite(ErrorMixin(base)) {
    static get properties () {
      return {
        filteredVenues: {
          type: Array,
          value: []
        }
      };
    }

    constructor () {
      super();
      this._boundChangeFilteredVenues = this.changeFilteredVenues.bind(this);
    }

    connectedCallback () {
      if (super.connectedCallback) super.connectedCallback();
      subscribe('filtered-venues', this._boundChangeFilteredVenues);
    }

    disconnectedCallback () {
      if (super.disconnectedCallback) super.disconnectedCallback();
      unsubscribe('filtered-venues', this._boundChangeFilteredVenues);
    }

    changeFilteredVenues (filteredVenues) {
      this.filteredVenues = filteredVenues;
    }
  }

  return GetFilteredVenuesMixin;
});
