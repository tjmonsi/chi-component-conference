import { TemplateLite } from '@tjmonsi/element-lite/mixins/template-lite.js';
import { PropertiesLite } from '@tjmonsi/element-lite/mixins/properties-lite.js';
import { ChiScheduleMixin } from '../../mixins/chi-schedule-mixin';
import { render, html } from 'lit-html';
import { template } from './template.js';
import style from './style.styl';
import '../chi-day';

const { HTMLElement, customElements } = window;

class Component extends TemplateLite(ChiScheduleMixin(PropertiesLite(HTMLElement))) {
  static get is () { return 'chi-full-schedule'; }

  static get properties () {
    return {
      hidden: {
        type: Boolean,
        value: false
      },
      loading: {
        type: Boolean,
        value: false
      },
      _baseUrl: {
        type: String,
        value: window.systemLocation || ''
      }
    };
  }

  static get renderer () { return render; }

  template () {
    return html`<style>${style.toString()}</style>${template(html, this)}`;
  }
}

if (!customElements.get(Component.is)) {
  customElements.define(Component.is, Component);
} else {
  console.warn(`${Component.is} is already defined somewhere. Please check your code.`);
}
