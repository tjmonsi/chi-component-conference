import { dedupingMixin } from '@tjmonsi/element-lite/lib/deduping-mixin.js';
import { ObserversLite } from '@tjmonsi/element-lite/mixins/observers-lite.js';
import { ErrorMixin } from '../../../general/mixins/error-mixin';
import { firebase } from '../../components/firebase-obj';
const collection = 'author';
const version = 'v1';
// const conferenceId = 'chi2019';

export const ChiAuthorMixin = dedupingMixin(base => {
  class ChiAuthorMixin extends /** @type {HTMLElement} */ ObserversLite(ErrorMixin(base)) {
    static get properties () {
      return {
        author: {
          type: Object
        },
        authorId: {
          type: String,
          observer: '_getAuthor'
        }
      };
    }

    constructor () {
      super();
      this._boundSetAuthor = this._setAuthor.bind(this);
    }

    disconnectedCallback () {
      super.disconnectedCallback();
      this._closeAuthor();
    }

    _getAuthor (authorId) {
      if (authorId) {
        this._closeAuthor();
        this._authorRef = firebase.database().ref(`${version}/${collection}-model/${collection}/${authorId}`);
        this._authorRef.on('value', this._boundSetAuthor);
      }
    }

    _closeAuthor () {
      if (this._authorRef) this._authorRef.off('value', this._boundSetAuthor);
    }

    _setAuthor (snapshot) {
      this.author = snapshot.val();
    }
  }

  return ChiAuthorMixin;
});
