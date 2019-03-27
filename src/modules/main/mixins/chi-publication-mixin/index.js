import { dedupingMixin } from '@tjmonsi/element-lite/lib/deduping-mixin.js';
import { ObserversLite } from '@tjmonsi/element-lite/mixins/observers-lite.js';
import { ErrorMixin } from '../../../general/mixins/error-mixin';
import { firebase } from '../../components/firebase-obj';
const collection = 'publication';
const version = 'v1';

export const ChiPublicationMixin = dedupingMixin(base => {
  class ChiPublicationMixin extends /** @type {HTMLElement} */ ObserversLite(ErrorMixin(base)) {
    static get properties () {
      return {
        publication: {
          type: Object
        },
        publicationId: {
          type: String,
          observer: '_getPublication'
        },
        authors: {
          type: Array,
          value: []
        },
        loading: {
          type: Boolean,
          value: true
        }
      };
    }

    constructor () {
      super();
      this._boundSetPublication = this._setPublication.bind(this);
    }

    disconnectedCallback () {
      super.disconnectedCallback();
      this._closePublication();
    }

    _getPublication (publicationId) {
      if (publicationId) {
        this.loading = true;
        this._closePublication();
        this._publicationRef = firebase.database().ref(`${version}/${collection}-model/${collection}/${publicationId}`);
        this._publicationRef.on('value', this._boundSetPublication);
      }
    }

    _closePublication () {
      if (this._publicationRef) this._publicationRef.off('value', this._boundSetPublication);
    }

    _setPublication (snapshot) {
      this.publication = snapshot.val();
      this.loading = false;
      if (this.publication) {
        this._getAuthors(this.publication.authors);
      }

      // dispatchEvent(new CustomEvent('chi-layout-reflow'));
    }

    _getAuthors (authors) {
      const array = [];
      const keys = Object.keys(authors);
      for (let i = 0, l = keys.length; i < l; i++) {
        array.push({
          $key: keys[i],
          value: authors[keys[i]].value
        });
      }
      array.sort((i, j) => i.value - j.value);
      this.authors = array;
    }
  }

  return ChiPublicationMixin;
});
