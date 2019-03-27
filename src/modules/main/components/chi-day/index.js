import { TemplateLite } from '@tjmonsi/element-lite/mixins/template-lite.js';
import { ObserversLite } from '@tjmonsi/element-lite/mixins/observers-lite.js';
import { GetQueryMixin } from '../../mixins/get-query-mixin';
import { render, html } from 'lit-html';
import { template } from './template.js';
import style from './style.styl';

import '../chi-timeslot';

const { HTMLElement, customElements, requestAnimationFrame, history, dispatchEvent, CustomEvent } = window;

const monthNames = [
  'January', 'February', 'March',
  'April', 'May', 'June', 'July',
  'August', 'September', 'October',
  'November', 'December'
];
const formatDate = (date) => `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

class Component extends TemplateLite(GetQueryMixin(ObserversLite(HTMLElement))) {
  static get is () { return 'chi-day'; }

  static get properties () {
    return {
      day: {
        type: Object,
        observer: '_dayChanged'
      },
      timeslots: {
        type: Array
      },
      scheduleIndex: {
        type: Number
      },
      hidden: {
        type: Boolean,
        value: false,
        reflect: true
      }
    };
  }

  static get renderer () { return render; }

  template () {
    return html`<style>${style.toString()}</style>${template(html, this)}`;
  }

  static get observers () {
    return [
      '_checkParams(params, day, params.*)'
    ];
  }

  _getDateString (dateString) {
    return formatDate(new Date(dateString));
  }

  _dayChanged (day) {
    const keys = Object.keys(day.timeslots);
    const timeslots = [];
    for (let i = 0, l = keys.length; i < l; i++) {
      const key = keys[i];
      const obj = { ...day.timeslots[key], $key: key };
      timeslots.push(obj);
    }
    timeslots.sort((i, j) => (i.value - j.value));
    this.timeslots = timeslots;
    this.hidden = day.hidden;
  }

  _showDay () {
    requestAnimationFrame(() => {
      this.shadowRoot.querySelector(`.invi-anchor-day-${this.day.$key}`)
        .scrollIntoView(true);
    });
  }

  _checkParams (params, day) {
    if (day && params.scheduleId === day.$key) {
      this._showDay();
      setTimeout(() => {
        history.pushState({}, '', `?`);
        dispatchEvent(new CustomEvent('location-changed'));
      }, 1000);
    }
  }

  _closeSlots () {
    this.forceShowSessions = false;
  }

  _openSlots () {
    this.forceShowSessions = true;
  }
}

if (!customElements.get(Component.is)) {
  customElements.define(Component.is, Component);
} else {
  console.warn(`${Component.is} is already defined somewhere. Please check your code.`);
}
