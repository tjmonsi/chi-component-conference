import { TemplateLite } from '@tjmonsi/element-lite/mixins/template-lite.js';
import { ObserversLite } from '@tjmonsi/element-lite/mixins/observers-lite.js';
import { store } from '../chi-store';
import { updateState } from '../../../../utils/state';
import { render, html } from 'lit-html';
import { template } from './template.js';
import style from './style.styl';
import '@littleq/location-lite/location-lite';
import '@littleq/query-lite/query-lite';
import '../chi-search';
import '../chi-header';
import '../chi-day';
const { HTMLElement, customElements, requestAnimationFrame } = window;

class Component extends TemplateLite(ObserversLite(HTMLElement)) {
  static get is () { return 'chi-conference-component'; }

  static get renderer () { return render; }

  static get properties () {
    return {
      schedule: {
        type: Array,
        value: []
      },
      searchResultTypes: {
        type: Object
      },
      showFilterWarning: {
        type: Boolean,
        value: false
      },
      searching: {
        type: Boolean,
        value: false
      },
      hitsNumber: {
        type: Number,
        value: 0
      },
      search: {
        type: String
      },
      maps: {
        type: Boolean,
        value: false
      },
      room: {
        type: String
      },
      _baseUrl: {
        type: String,
        value: window.systemLocation || '/'
      }
    };
  }

  static get observers () {
    return [
      '_setMapRoom(maps, room)'
    ];
  }

  template () {
    return html`<style>${style.toString()}</style>${template(html, this)}`;
  }

  constructor () {
    super();
    this._boundScheduleUpdate = this._scheduleUpdate.bind(this);
  }

  connectedCallback () {
    if (super.connectedCallback) super.connectedCallback();
    window.addEventListener('chi-update-schedule', this._boundScheduleUpdate);
    window.addEventListener('chi-update-query', this._boundScheduleUpdate);

    setTimeout(() => {
      const target = this.shadowRoot.querySelector('.on-top');
      const fixed = this.shadowRoot.querySelector('.fixed');
      const options = { threshold: 0 };

      this._observer = new window.IntersectionObserver((entries, observer) => {
        entries.forEach(({ target: entryTarget, isIntersecting }) => {
          if (entryTarget) {
            fixed.style.display = isIntersecting ? 'none' : 'block';
            if (target._filterContainer || fixed._filterContainer) {
              if (!isIntersecting) {
                fixed.openFilter();
                target.closeFilter();
              } else {
                target.openFilter();
                fixed.closeFilter();
              }
            }

            if (target._navigationContainer || fixed._navigationContainer) {
              if (!isIntersecting) {
                fixed.openNavigation();
                target.closeNavigation();
              } else {
                target.openNavigation();
                fixed.closeNavigation();
              }
            }
          }
        });
      }, options);

      this._observer.observe(target);
    }, 500);
  }

  disconnectedCallback () {
    if (super.disconnectedCallback) super.disconnectedCallback();
    window.removeEventListener('chi-update-schedule', this._boundScheduleUpdate);
    window.removeEventListener('chi-update-query', this._boundScheduleUpdate);
  }

  propChanged ({ detail }, prop) {
    this[prop] = detail;
  }

  queryObjectChanged ({ detail: query }) {
    updateState('query', query);
  }

  queryChanged ({ detail: query }) {
    const el = this.shadowRoot.querySelector('query-lite');
    if (el) {
      el.query = query;
    }
  }

  _scheduleUpdate () {
    const keys = Object.keys(store.schedule);
    const schedule = [];
    for (let i = 0, l = keys.length; i < l; i++) {
      const key = keys[i];
      const obj = { ...store.schedule[key], $key: key };
      schedule.push(obj);
    }
    schedule.sort((i, j) => (i.index - j.index));
    this.schedule = schedule;
    console.log(this.schedule);
    const loadingScreen = document.querySelector('#loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    }
  }

  _setMapRoom (maps, room) {
    if (maps) {
      requestAnimationFrame(() => {
        // const level2 = this.shadowRoot.querySelector('.level-2');
        // const level5 = this.shadowRoot.querySelector('.level-5');
        // const exmon = this.shadowRoot.querySelector('.exhibit-mon');
        // const extue = this.shadowRoot.querySelector('.exhibit-tue');
        // const sat = this.shadowRoot.querySelector('.la-sat');

        // if (room) {
        //   if (room.indexOf('SAT') >= 0 && sat) {
        //     setTimeout(() => {
        //       sat.scrollIntoView(true);
        //     }, 200);
        //   } else if (parseInt(room[0], 10) === 5 && level5) {
        //     setTimeout(() => {
        //       level5.scrollIntoView(true);
        //     }, 200);
        //   } else if (parseInt(room[0], 10) === 2 && level2) {
        //     setTimeout(() => {
        //       level2.scrollIntoView(true);
        //     }, 200);
        //   } else {
        //     setTimeout(() => {
        //       window.scroll(0, 0);
        //     }, 200);
        //   }
        // }
      });
    }
  }
}

if (!customElements.get(Component.is)) {
  customElements.define(Component.is, Component);
} else {
  console.warn(`${Component.is} is already defined somewhere. Please check your code.`);
}
