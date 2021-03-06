import { ObserversLite } from '@tjmonsi/element-lite/mixins/observers-lite.js';
import { store } from '../chi-store';
import { defaultFilteredSearch } from '../../../../utils/default-filtered-search';
import { GetQueryMixin } from '../../mixins/get-query-mixin';
import { GetFilteredVenuesMixin } from '../../mixins/get-filtered-venues-mixin';
import { GetFilteredSearchMixin } from '../../mixins/get-filtered-search-mixin';
import { GetVenuesMixin } from '../../mixins/get-venues-mixin';
import { updateState } from '../../../../utils/state';
import { toastr } from '../toastr-component';
import algoliasearch from 'algoliasearch/lite';
const { HTMLElement, customElements, history, dispatchEvent, CustomEvent } = window;

const client = algoliasearch('H5CTKT5Q2T', '63c3aaf1f73c07be6cb9e171ef72dc23');
const index = client.initIndex(`chi-index-chi2019`);

class Component extends GetVenuesMixin(GetFilteredSearchMixin(GetFilteredVenuesMixin(GetQueryMixin(ObserversLite(HTMLElement))))) {
  static get is () { return 'chi-search'; }

  static get properties () {
    return {
      defaultFilteredSearch: {
        type: Array,
        value: defaultFilteredSearch
      },
      queryResults: {
        type: Array,
        value: [],
        observer: '_queryResultChanged'
      },
      showFilterWarning: {
        type: Boolean,
        value: false,
        notify: true
      },
      searching: {
        type: Boolean,
        value: false,
        notify: true
      },
      hitsNumber: {
        type: Number,
        value: 0,
        notify: true
      },
      searchResultTypes: {
        type: Object,
        value: {},
        notify: true
      },
      search: {
        type: String,
        value: '',
        notify: true
      },
      maps: {
        type: Boolean,
        value: false,
        notify: true
      },
      room: {
        type: String,
        value: '',
        notify: true
      }
    };
  }

  static get observers () {
    return [
      '_checkParams(params, filteredSearch)',
      '_checkFilteredVenues(filteredVenues)'
    ];
  }

  constructor () {
    super();
    this._boundStoreUpdate = this._storeUpdate.bind(this);
  }

  connectedCallback () {
    super.connectedCallback();
    window.addEventListener('chi-update-session', this._boundStoreUpdate);
  }

  _checkFilteredVenues (filteredVenues) {
    if (filteredVenues && filteredVenues.length && filteredVenues.indexOf('all') < 0) {
      history.pushState({}, '', `?${this.params.search ? `search=${encodeURI(this.params.search)}&` : ''}filteredVenues=${encodeURI(filteredVenues.join(','))}`);
      dispatchEvent(new CustomEvent('location-change'));
    }
    this._storeUpdate();
  }

  _filterVenues (filteredVenues) {
    for (let i in store.session) {
      if (filteredVenues.indexOf(store.session[i].venue.toLowerCase()) >= 0) {
        store.session[i].hidden = false;
      }
    }

    for (let i in store.timeslot) {
      let hidden = true;
      // console.log(store.timeslot[i].sessions)
      for (let j in store.timeslot[i].sessions) {
        if (store.session[j].hidden === false) {
          hidden = false;
          break;
        }
      }
      store.timeslot[i].hidden = hidden;
    }

    for (let i in store.schedule) {
      let hidden = true;
      for (let j in store.schedule[i].timeslots) {
        if (store.timeslot[j].hidden === false) {
          hidden = false;
          break;
        }
      }
      store.schedule[i].hidden = hidden;
    }
    // window.dispatchEvent(new window.CustomEvent('chi-update-schedule'));
    // console.log('update');
  }

  _updateFilteredVenues (filteredVenues) {
    if (this.filteredVenues.join(',') !== filteredVenues.join(',')) {
      updateState('filtered-venues', filteredVenues);
    }
  }

  _storeUpdate () {
    if (this.queryResults.length) {
      this._queryResultChanged(this.queryResults);
    } else {
      this._hideAll();
      if (this.filteredVenues.indexOf('all') >= 0) {
        this._showAll();
        return;
      }
      this._filterVenues(this.filteredVenues);
      window.dispatchEvent(new window.CustomEvent('chi-update-query'));
    }
    this._queryResultChanged(this.queryResults);
  }

  _checkParams (params, filteredSearch, currentScheduleId) {
    this.maps = !!params.maps;
    this.room = params.room || null;
    this.search = params.search;

    // reset
    for (const i in store.schedule) {
      store.schedule[i].hidden = false;
      store.schedule[i].expand = false;
    }

    for (const i in store.session) {
      store.session[i].hidden = false;
    }

    for (const i in store.timeslot) {
      store.timeslot[i].hidden = false;
    }

    store.showPublications = [];

    console.log(store);

    if (params.filteredVenues) {
      this._updateFilteredVenues(params.filteredVenues.split(','));
    }

    this._queryChanged(params.search, filteredSearch);

    window.dispatchEvent(new CustomEvent('chi-update-schedule'));
  }

  async _queryChanged (query, filteredSearch) {
    this.searching = true;
    this.showFilterWarning = false;
    if (query) window.scroll(0, 0);
    const settings = {
      query,
      hitsPerPage: 100,
      attributesToRetrieve: [
        'authors', 'conferenceId', 'searchType', 'sessionId', 'timeslots', 'publications', 'scheduleId', 'timeslotId'
      ],
      typoTolerance: 'strict'
    };

    // console.log(filteredSearch)
    if (filteredSearch && filteredSearch.length === 0) {
      toastr.info('You need at least one search filter to use search');
      return;
    }

    if (filteredSearch && filteredSearch.length && filteredSearch.indexOf('all') < 0) {
      settings.restrictSearchableAttributes = [];
      const searchType = [];
      for (let filter of filteredSearch) {
        switch (filter) {
          case 'people':
            settings.restrictSearchableAttributes = [ ...settings.restrictSearchableAttributes, 'displayName', 'email', 'firstName', 'lastName' ];
            if (searchType.indexOf('author') < 0) searchType.push('author');
            break;
          case 'institution':
            settings.restrictSearchableAttributes = [ ...settings.restrictSearchableAttributes, 'primary.institution', 'primary.dept', 'primary.city', 'primary.country', 'secondary.institution', 'secondary.dept', 'secondary.city', 'secondary.country' ];
            if (searchType.indexOf('author') < 0) searchType.push('author');
            break;
          case 'session':
            if (settings.restrictSearchableAttributes.indexOf('title') < 0) settings.restrictSearchableAttributes = [ ...settings.restrictSearchableAttributes, 'title' ];
            if (searchType.indexOf('session') < 0) searchType.push('session');
            break;
          case 'paper-title':
            if (settings.restrictSearchableAttributes.indexOf('title') < 0) settings.restrictSearchableAttributes = [ ...settings.restrictSearchableAttributes, 'title' ];
            if (searchType.indexOf('publication') < 0) searchType.push('publication');
            break;
          case 'abstract':
            settings.restrictSearchableAttributes = [ ...settings.restrictSearchableAttributes, 'abstract', 'shortText' ];
            if (searchType.indexOf('publication') < 0) searchType.push('publication');
            break;
        }
      }
      if (searchType.length) {
        settings.filters = searchType.map(item => `searchType:${item}`).join(' OR ');
      }
    }

    if (!query) {
      this.searching = false;
      this.hitsNumber = 0;
      this.queryResults = [];
      store.search = '';
    }

    store.search = query;

    try {
      const { hits: queryResults, nbHits } = query
        ? await index.search(settings)
        : { hits: [] };
      this.searching = false;
      this.hitsNumber = nbHits;
      this.queryResults = queryResults;
    } catch (error) {
      console.log(error);
    }
  }

  _hideAll () {
    for (let s in store.schedule) {
      store.schedule[s].hidden = true;
      store.schedule[s].expand = false;
    }

    for (let t in store.timeslot) {
      store.timeslot[t].hidden = true;
      store.timeslot[t].expand = false;
    }

    for (let ss in store.session) {
      store.session[ss].hidden = true;
      store.session[ss].expand = false;
    }

    store.showPublications = [];
    store.keywords = [];
  }

  _showAll () {
    for (let s in store.schedule) {
      store.schedule[s].hidden = false;
      store.schedule[s].expand = false;
    }

    for (let t in store.timeslot) {
      store.timeslot[t].hidden = false;
      store.timeslot[t].expand = false;
    }

    for (let ss in store.session) {
      store.session[ss].hidden = false;
      store.session[ss].expand = false;
    }

    store.showPublications = [];
    store.keywords = [];
    store.search = '';
    window.dispatchEvent(new window.CustomEvent('chi-update-query'));
  }

  _queryResultChanged (queryResults) {
    // console.log(queryResults)
    if (queryResults.length === 0) {
      this._showAll();
      return;
    }

    const searchResultTypes = {
      author: 0,
      primaryInstitution: 0,
      secondaryInstitution: 0,
      publication: 0,
      session: 0,
      publicationList: [],
      displayNameList: [],
      displayNamePublicationList: [],
      primaryInstitutionList: [],
      secondaryInstitutionList: [],
      secondaryPublicationInstutionList: []
    };

    this._hideAll();

    for (let hit of queryResults) {
      const { searchType, publications, scheduleId, timeslotId, objectID, sessionId, _highlightResult } = hit;

      for (let i in _highlightResult) {
        let value = _highlightResult[i];
        if (value.matchedWords && value.matchedWords.length) {
          value.value.split('<em>').forEach(node => {
            const term = node.split('</em>')[0];
            if (node.indexOf('</em>') >= 0 && term && store.keywords.findIndex(item => item[1] === term.toLowerCase()) < 0) store.keywords.push([term, term.toLowerCase()]);
          });
        } else {
          Object.entries(value).forEach(([subkey, subvalue]) => {
            if (subvalue.matchedWords && subvalue.matchedWords.length) {
              subvalue.value.split('<em>').forEach(node => {
                const term = node.split('</em>')[0];
                if (node.indexOf('</em>') >= 0 && term && store.keywords.findIndex(item => item[1] === term.toLowerCase()) < 0) store.keywords.push([term, term.toLowerCase()]);
              });
            }
          });
        }
      }

      if (searchType === 'session') {
        if (store.session[objectID] && (this.filteredVenues.indexOf('all') >= 0 || this.filteredVenues.indexOf(store.session[objectID].venue) >= 0)) {
          store.session[objectID].hidden = false;
          store.session[objectID].expand = true;
          store.timeslot[timeslotId].hidden = false;
          store.timeslot[timeslotId].expand = true;
          store.schedule[scheduleId].hidden = false;
          store.schedule[scheduleId].expand = true;

          for (let ps in store.session[objectID].publications) {
            if (store.showPublications.indexOf(ps) < 0) store.showPublications.push(ps);
          }
        }
      }

      if (searchType === 'publication') {
        if (store.session[sessionId] && (this.filteredVenues.indexOf('all') >= 0 || this.filteredVenues.indexOf(store.session[sessionId].venue) >= 0)) {
          store.session[sessionId].hidden = false;
          store.session[sessionId].expand = true;
          if (store.showPublications.indexOf(objectID) < 0) store.showPublications.push(objectID);
          if (store.timeslot[store.session[sessionId].timeslotId]) {
            store.timeslot[store.session[sessionId].timeslotId].hidden = false;
            store.timeslot[store.session[sessionId].timeslotId].expand = true;
          }
          if (store.schedule[store.session[sessionId].scheduleId]) {
            store.schedule[store.session[sessionId].scheduleId].hidden = false;
            store.schedule[store.session[sessionId].scheduleId].expand = true;
          }
        }
      }

      if (searchType === 'author') {
        const { displayName, primary, secondary } = _highlightResult;
        const { institution } = primary;
        const { institution: institution2 } = secondary;

        let value = institution;
        if (value.matchedWords && value.matchedWords.length) {
          value.value.split('<em>').forEach(node => {
            const term = node.split('</em>')[0];
            if (node.indexOf('</em>') >= 0 && term && store.keywords.findIndex(item => item[1] === term.toLowerCase()) < 0) store.keywords.push([term, term.toLowerCase()]);
          });
        } else {
          Object.entries(value).forEach(([subkey, subvalue]) => {
            if (subvalue.matchedWords && subvalue.matchedWords.length) {
              subvalue.value.split('<em>').forEach(node => {
                const term = node.split('</em>')[0];
                if (node.indexOf('</em>') >= 0 && term && store.keywords.findIndex(item => item[1] === term.toLowerCase()) < 0) store.keywords.push([term, term.toLowerCase()]);
              });
            }
          });
        }

        const displayNameItem = displayName.value.replace(/<em>/g, '').replace(/<\/em>/g, '');

        for (let psa in publications) {
          if (store.showPublications.indexOf(psa) < 0) store.showPublications.push(psa);
          for (let ses in store.session) {
            if (store.session[ses] && store.session[ses].publications && store.session[ses].publications[psa] && (this.filteredVenues.indexOf('all') >= 0 || this.filteredVenues.indexOf(store.session[ses].venue) >= 0)) {
              store.session[ses].hidden = false;
              store.session[ses].expand = true;
              store.timeslot[store.session[ses].timeslotId].hidden = false;
              store.timeslot[store.session[ses].timeslotId].expand = true;
              store.schedule[store.session[ses].scheduleId].hidden = false;
              store.schedule[store.session[ses].scheduleId].expand = true;
            }
          }
        }

        if (displayName.matchedWords.length) {
          let index = searchResultTypes.displayNameList.findIndex(item => item.displayName === displayNameItem);
          if (index < 0) {
            searchResultTypes.displayNameList.push({
              displayName: displayNameItem,
              publications: []
            });
            index = searchResultTypes.displayNameList.length - 1;
          }
          const pkeys = Object.keys(publications);

          for (let i = 0, l = pkeys.length; i < l; i++) {
            const pub = pkeys[i];
            if (searchResultTypes.displayNameList[index].publications.indexOf(pub) < 0) searchResultTypes.displayNameList[index].publications.push(pub);
          }

          searchResultTypes[searchType] = searchResultTypes.displayNameList.length;
        }

        const institutionItem = institution.value.replace(/<em>/g, '').replace(/<\/em>/g, '');

        if (institution.matchedWords.length) {
          let index = searchResultTypes.primaryInstitutionList.findIndex(item => item.institution === institutionItem);
          if (index < 0) {
            searchResultTypes.primaryInstitutionList.push({
              institution: institutionItem,
              publications: []
            });
            index = searchResultTypes.primaryInstitutionList.length - 1;
          }

          const pkeys = Object.keys(publications);

          for (let i = 0, l = pkeys.length; i < l; i++) {
            const pub = pkeys[i];
            if (searchResultTypes.primaryInstitutionList[index].publications.indexOf(pub) < 0) searchResultTypes.primaryInstitutionList[index].publications.push(pub);
          }

          searchResultTypes.primaryInstitution = searchResultTypes.primaryInstitutionList.length;
        }

        const institution2Item = institution2.value.replace(/<em>/g, '').replace(/<\/em>/g, '');

        if (institution2.matchedWords.length) {
          let index = searchResultTypes.secondaryInstitutionList.findIndex(item => item.institution === institution2Item);
          if (index < 0) {
            searchResultTypes.secondaryInstitutionList.push({
              institution: institution2Item,
              publications: []
            });
            index = searchResultTypes.secondaryInstitutionList.length - 1;
          }

          const pkeys = Object.keys(publications);

          for (let i = 0, l = pkeys.length; i < l; i++) {
            const pub = pkeys[i];
            if (searchResultTypes.secondaryInstitutionList[index].publications.indexOf(pub) < 0) searchResultTypes.secondaryInstitutionList[index].publications.push(pub);
          }

          searchResultTypes.secondaryInstitution = searchResultTypes.secondaryInstitutionList.length;
        }

        if (institution2.matchedWords.length && searchResultTypes.secondaryInstitutionList.indexOf(institution2Item) < 0) {
          if (institution.matchedWords.length) {
            searchResultTypes.secondaryInstitutionList.push(institution2Item);

            const pkeys = Object.keys(publications);

            for (let i = 0, l = pkeys.length; i < l; i++) {
              const pub = pkeys[i];
              if (searchResultTypes.secondaryPublicationInstutionList.indexOf(pub) < 0) searchResultTypes.secondaryPublicationInstutionList.push(pub);
            }
          }
          searchResultTypes.secondaryInstitution = searchResultTypes.secondaryPublicationInstutionList.length;
        }

        continue;
      }
      searchResultTypes[searchType]++;
    }

    // this.set('searchResultTypes', searchResultTypes);
    // this.dispatch ({ type: CHI_STATE.SEARCH_RESULT_TYPES, searchResultTypes });

    if (this.hitsNumber > 100) {
      this.showFilterWarning = true;

      this._showAll();
      return;
    }

    if (this._filterContainer) this.toggleFilter();
    this.searchResultTypes = searchResultTypes;
    // this.dispatch ({ type: CHI_STATE.QUERY_RESULTS, queryResults });

    store.search = this.params.search;

    window.dispatchEvent(new window.CustomEvent('chi-update-query'));
  }
}

if (!customElements.get(Component.is)) {
  customElements.define(Component.is, Component);
} else {
  console.warn(`${Component.is} is already defined somewhere. Please check your code.`);
}
