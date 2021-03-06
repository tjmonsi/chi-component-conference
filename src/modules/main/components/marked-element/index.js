import { ObserversLite } from '@tjmonsi/element-lite/mixins/observers-lite.js';
import { store } from '../chi-store';
import marked from 'marked';
import { GetQueryResultsMixin } from '../../mixins/get-query-results-mixin';
import '../chi-day';

const { HTMLElement, customElements, requestAnimationFrame } = window;

class Component extends GetQueryResultsMixin(ObserversLite(HTMLElement)) {
  static get is () { return 'marked-element'; }

  static get properties () {
    return {
      marked: {
        type: String
      }
    };
  }

  static get observers () {
    return [
      '_checkMarked(marked)'
    ];
  }

  constructor () {
    super();
    this._boundStoreUpdate = this._storeUpdate.bind(this);
  }

  connectedCallback () {
    super.connectedCallback();
    window.addEventListener('chi-update-query', this._boundStoreUpdate);
  }

  disconnectedCallback () {
    super.disconnectedCallback();
    window.removeEventListener('chi-update-query', this._boundStoreUpdate);
  }

  _storeUpdate () {
    this._checkMarked(this.marked);
  }

  _checkMarked (string) {
    requestAnimationFrame(() => {
      setTimeout(() => {
        let newString = string || '';
        const search = store.keywords || [];
        // if (store.keywords.length) {
        //   for (let word of store.keywords) {
        //     let keys = Object.keys(hit._highlightResult);

        //     for (let i = 0, l = keys.length; i < l; i++) {
        //       let key = keys[i];
        //       let value = hit._highlightResult[key];
        //       if (value.matchedWords && value.matchedWords.length) {
        //         value.value.split('<em>').forEach(node => {
        //           const term = node.split('</em>')[0];
        //           if (node.indexOf('</em>') >= 0 && term && search.findIndex(item => item[1] === term.toLowerCase()) < 0) search.push([term, term.toLowerCase()]);
        //         });
        //       } else {
        //         Object.entries(value).forEach(([subkey, subvalue]) => {
        //           if (subvalue.matchedWords && subvalue.matchedWords.length) {
        //             subvalue.value.split('<em>').forEach(node => {
        //               const term = node.split('</em>')[0];
        //               if (node.indexOf('</em>') >= 0 && term && search.findIndex(item => item[1] === term.toLowerCase()) < 0) search.push([term, term.toLowerCase()]);
        //             });
        //           }
        //         });
        //       }
        //     }
        //   }
        // }
        for (let searchIndex = 0, len = search.length; searchIndex < len; searchIndex++) {
          let [term] = search[searchIndex];
          if (term.length > 1) {
            while (newString.toLowerCase().indexOf(term.toLowerCase()) >= 0) {
              let index = newString.toLowerCase().indexOf(term.toLowerCase());
              newString = newString.slice(0, index) + `$$$$__${searchIndex}__&&&&` + newString.slice(index + term.length);
            }
          }
        }

        for (let index = 0, len = search.length; index < len; index++) {
          let [term] = search[index];
          newString = newString.replace(new RegExp(`__${index}__`, 'g'), term);
        }

        // search.forEach(([term], searchIndex) => {

        //   // newString = newString.replace(/\$\$1\&\&/g, `<mark class="mark">${term}</mark>`);
        // });
        // search.forEach(([term], index) => {

        // });

        // console.log(newString)

        newString = newString.replace(/ \\ /g, ' ').replace(/`/g, '\'').replace(/\$\$\$\$/g, '<mark class="mark">').replace(/&&&&/g, '</mark>');
        if (newString) this.innerHTML = marked(newString).replace(/<p>/g, '').replace(/<\/p>/g, '');
      }, 100);
    });
  }
}

if (!customElements.get(Component.is)) {
  customElements.define(Component.is, Component);
} else {
  console.warn(`${Component.is} is already defined somewhere. Please check your code.`);
}
