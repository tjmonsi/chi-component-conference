import { TemplateLite } from '@tjmonsi/element-lite/mixins/template-lite.js';
import { PropertiesLite } from '@tjmonsi/element-lite/mixins/properties-lite.js';
import { render, html } from 'lit-html';
import { template } from './template.js';
import style from './style.styl';
import { ChiAuthorMixin } from '../../mixins/chi-author-mixin/index.js';
// import '../';
import '../marked-element';

const { HTMLElement, customElements } = window;

class Component extends TemplateLite(ChiAuthorMixin(PropertiesLite(HTMLElement))) {
  static get is () { return 'chi-author'; }

  static get properties () {
    return {
      publicationId: {
        type: String
      }
    };
  }

  static get renderer () { return render; }

  template () {
    return html`<style>${style.toString()}</style>${template(html, this)}`;
  }

  getNameAndInstitution (displayName, primarySet, secondarySet, publicationId) {
    const array = [`**${displayName}**`];
    const primaryArray = [];
    const secondaryArray = [];
    const institutions = [];
    if (publicationId && this.author) {
      const primary = (primarySet && primarySet[publicationId]) || this.author.primary;
      const secondary = (secondarySet && secondarySet[publicationId]) || this.author.secondary;
      if (primary.institution) {
        primaryArray.push(primary.institution);
      } else if (primary.dept) {
        primaryArray.push(primary.dept);
      }
      if (secondary.institution) {
        secondaryArray.push(secondary.institution);
      } else if (secondary.dept) {
        secondaryArray.push(secondary.dept);
      }
      const primaryString = primaryArray.length ? primaryArray.join(', ') : '';
      const secondaryString = secondaryArray.length ? secondaryArray.join(', ') : '';
      if (primaryString) {
        institutions.push(primaryString);
      }
      if (secondaryString) {
        institutions.push(secondaryString);
      }
      const institutionString = institutions.length ? institutions.join('; ') : '';
      if (institutionString) {
        array.push(institutionString);
      }
      return array.length ? array.join(', ') : '';
    }
  }
}

if (!customElements.get(Component.is)) {
  customElements.define(Component.is, Component);
} else {
  console.warn(`${Component.is} is already defined somewhere. Please check your code.`);
}
