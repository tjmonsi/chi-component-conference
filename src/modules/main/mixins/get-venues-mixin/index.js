import { dedupingMixin } from '@tjmonsi/element-lite/lib/deduping-mixin.js';
import { PropertiesLite } from '@tjmonsi/element-lite/mixins/properties-lite.js';
import { ErrorMixin } from '../../../general/mixins/error-mixin';
import { subscribe, unsubscribe } from '../../../../utils/state';

export const GetVenuesMixin = dedupingMixin(base => {
  class GetVenuesMixin extends /** @type {HTMLElement} */ PropertiesLite(ErrorMixin(base)) {
    static get properties () {
      return {
        venues: {
          type: Array,
          value: []
        }
      };
    }

    constructor () {
      super();
      this._boundChangeVenues = this.changeVenues.bind(this);
    }

    connectedCallback () {
      if (super.connectedCallback) super.connectedCallback();
      subscribe('venues', this._boundChangeVenues);
    }

    disconnectedCallback () {
      if (super.disconnectedCallback) super.disconnectedCallback();
      unsubscribe('venues', this._boundChangeVenues);
    }

    changeVenues (venues) {
      this.venues = venues;
    }
  }

  return GetVenuesMixin;
});
