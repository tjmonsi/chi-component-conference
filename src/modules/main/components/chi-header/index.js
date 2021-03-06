import { TemplateLite } from '@tjmonsi/element-lite/mixins/template-lite.js';
import { ObserversLite } from '@tjmonsi/element-lite/mixins/observers-lite.js';
import { defaultFilteredSearch } from '../../../../utils/default-filtered-search';
import { debounce } from '../../../../utils/debounce';
import { GetQueryMixin } from '../../mixins/get-query-mixin';
import { GetFilteredVenuesMixin } from '../../mixins/get-filtered-venues-mixin';
import { GetFilteredSearchMixin } from '../../mixins/get-filtered-search-mixin';
import { GetVenuesMixin } from '../../mixins/get-venues-mixin';
import { updateState } from '../../../../utils/state';
import { store } from '../chi-store';
import { toastr } from '../toastr-component';
import { render, html } from 'lit-html';
import { template } from './template.js';
import style from './style.styl';

const { HTMLElement, customElements, history, dispatchEvent, CustomEvent } = window;

class Component extends TemplateLite(GetVenuesMixin(GetFilteredSearchMixin(GetFilteredVenuesMixin(GetQueryMixin(ObserversLite(HTMLElement)))))) {
  static get is () { return 'chi-header'; }

  static get properties () {
    return {
      currentScheduleId: {
        type: String
      },
      defaultFilteredSearch: {
        type: Array,
        value: defaultFilteredSearch
      },
      _baseUrl: {
        type: String,
        value: window.systemLocation || '/'
      }
    };
  }

  static get renderer () { return render; }

  template () {
    return html`<style>${style.toString()}</style>${template(html, this)}`;
  }

  static get observers () {
    return [
      '_checkParams(params, currentScheduleId)'
    ];
  }

  constructor () {
    super();
    this._debouncedSearch = debounce(this.search.bind(this), 2000);
    this._boundStoreUpdate = this._storeUpdate.bind(this);
  }

  connectedCallback () {
    super.connectedCallback();
    window.addEventListener('chi-update-session', this._boundStoreUpdate);
  }

  disconnectedCallback () {
    super.disconnectedCallback();
    window.removeEventListener('chi-update-session', this._boundStoreUpdate);
  }

  _checkParams (params, currentScheduleId) {
    if (params.scheduleId !== currentScheduleId) {
      this.currentScheduleId = params.scheduleId;
      this.closeNavigation();
    }

    const search = this.shadowRoot.querySelector('[name=search]');
    if (search) {
      search.value = (params && params.search) || '';
    }
  }

  _storeUpdate () {
    updateState('venues', store.venueList);
  }

  _slugifyClass (venue) {
    return venue && venue.toLowerCase().replace(/ /, '-');
  }

  _returnSearch (filter) {
    return filter && filter.length && filter.map(item => this.getSearch(item)).join(', ');
  }

  _returnVenues (filter) {
    return filter && filter.length && filter.map(item => this.getVenue(item)).join(', ');
  }

  _ifTheresAll (filter) {
    return filter && filter.length && filter.indexOf('all') >= 0;
  }

  _onChangeQuery () {
    this._debouncedSearch();
  }

  getVenue (venue) {
    switch (venue.toLowerCase()) {
      case 'altchi':
        return 'alt.chi';
      case 'casestudy':
        return 'Case Studies';
      case 'docconsortium':
        return 'Doctoral Consortium';
      case 'keynote':
        return 'Plenaries';
      case 'sig':
        return 'Special Interest Groups (SIG)';
      case 'videoshowcase':
        return 'Video Showcase';
      case 'awards':
        return 'Awards';
      case 'art':
        return 'Art';
      case 'lbw':
        return 'Late-breaking Work';
      default:
        return venue.charAt(0).toUpperCase() + venue.slice(1) + 's';
    }
  }

  openNavigation () {
    this.shadowRoot.querySelectorAll('.nav-button.menu').forEach(node => (node.style.display = 'none'));
    this.shadowRoot.querySelectorAll('.nav-button.close').forEach(node => (node.style.display = 'block'));
    this.shadowRoot.querySelector('.fixed-phone').style.display = 'block';
    // this.shadowRoot.querySelector('.filter-container').style.display = 'none';
    this._filterContainer = false;
    this._navigationContainer = true;
  }

  closeNavigation () {
    this.shadowRoot.querySelectorAll('.nav-button.menu').forEach(node => (node.style.display = 'block'));
    this.shadowRoot.querySelectorAll('.nav-button.close').forEach(node => (node.style.display = 'none'));
    this.shadowRoot.querySelector('.fixed-phone').style.display = 'none';
    // this.shadowRoot.querySelector('.filter-container').style.display = 'none';
    this._filterContainer = false;
    this._navigationContainer = false;
  }

  showClear (search, filteredSearch, filteredVenues) {
    return search || (filteredSearch && filteredSearch.indexOf('all') < 0) || (filteredVenues && filteredVenues.indexOf('all') < 0);
  }

  formSearch (e) {
    e.preventDefault();
    this.search();
  }

  search () {
    const query = this.shadowRoot.querySelector('[name=search]').value;
    history.pushState({}, '', query ? `?search=${query}` : '?sessionId=all');
    window.dispatchEvent(new CustomEvent('location-change'));
  }

  clear () {
    const queryParams = [];
    for (let q in this.params) {
      if (q !== 'search' && q !== 'filteredVenues') queryParams.push(`${q}=${this.params[q]}`);
    }
    history.pushState({}, '', `?${queryParams.join('&')}`);
    dispatchEvent(new CustomEvent('location-change'));

    updateState('fitered-venues', ['all']);
    updateState('fitered-search', ['all']);
  }

  openFilter () {
    this._filterContainer = true;
    this.toggleFilter();
  }

  closeFilter () {
    this._filterContainer = false;
    this.toggleFilter();
  }

  filter () {
    this._filterContainer = !this._filterContainer;
    this.toggleFilter();
  }

  toggleFilter () {
    this.shadowRoot.querySelectorAll('.nav-button.menu').forEach(node => (node.style.display = 'block'));
    this.shadowRoot.querySelectorAll('.nav-button.close').forEach(node => (node.style.display = 'none'));
    this.shadowRoot.querySelector('.fixed-phone').style.display = 'none';
    this.shadowRoot.querySelector('.filter-container').style.display = this._filterContainer ? 'block' : 'none';
    this._navigationContainer = false;
  }

  toggleVenueFilter ({ target: el }) {
    // console.log(this.shadowRoot.querySelector('#filterForm').filter)
    setTimeout(() => {
      if (el.nodeType === 'LABEL') {
        el = el.querySelector('input[type=checkbox]');
      }
      const { value, checked } = el;
      if (value === 'all' && !checked) {
        toastr.info('You need at least one venue checked to see the schedule.');
        return updateState('fitered-venues', []);
      }
      const filteredVenues = [ ...this.filteredVenues ];
      const index = filteredVenues.indexOf(value);
      if (checked && index < 0) filteredVenues.push(value);
      else if (!checked && index >= 0) {
        filteredVenues.splice(index, 1);
        if (filteredVenues.indexOf('all') >= 0) filteredVenues.splice(filteredVenues.indexOf('all'), 1);
      }

      if (this._filterContainer) this.toggleFilter();
      updateState('fitered-venues', filteredVenues);
    }, 10);
  }

  toggleSearchFilter (event) {
    event.stopPropagation();
    let { target: el } = event;
    if (el.tagName === 'LABEL') {
      el = el.querySelector('input[type=checkbox]');
    }
    const { value, checked } = el;
    setTimeout(() => {
      if (value === 'all' && !checked) {
        return updateState('fitered-search', []);
      }
      const filteredSearch = [ ...this.filteredSearch ];
      const index = filteredSearch.indexOf(value);
      if (checked && index < 0) filteredSearch.push(value);
      else if (!checked && index >= 0) {
        filteredSearch.splice(index, 1);
        if (filteredSearch.indexOf('all') >= 0) filteredSearch.splice(filteredSearch.indexOf('all'), 1);
      }
      if (this._filterContainer) this.toggleFilter();
      updateState('fitered-search', filteredSearch);
    }, 10);
  }

  getSearch (filter) {
    switch (filter.toLowerCase()) {
      case 'paper-title':
        return 'Paper Title';

      default:
        return filter.charAt(0).toUpperCase() + filter.slice(1);
    }
  }

  _checkIfFiltered (venue, filteredVenues) {
    return venue && filteredVenues && filteredVenues.length && filteredVenues.indexOf(venue) >= 0;
  }

  _checkSearchFiltered (filter, filteredSearch) {
    return filter && filteredSearch && filteredSearch.length && filteredSearch.indexOf(filter) >= 0;
  }
}

if (!customElements.get(Component.is)) {
  customElements.define(Component.is, Component);
} else {
  console.warn(`${Component.is} is already defined somewhere. Please check your code.`);
}
