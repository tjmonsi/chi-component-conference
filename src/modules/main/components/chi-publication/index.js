import { TemplateLite } from '@tjmonsi/element-lite/mixins/template-lite.js';
import { PropertiesLite } from '@tjmonsi/element-lite/mixins/properties-lite.js';
import { render, html } from 'lit-html';
import { template } from './template.js';
import style from './style.styl';
import '../chi-day';
import { ChiPublicationMixin } from '../../mixins/chi-publication-mixin/index';
import { GetQueryMixin } from '../../mixins/get-query-mixin/index.js';
import { toastr } from '../toastr-component';
import { store } from '../chi-store';
import '../dialog-box';
import '../marked-element';
import '../chi-author';

const { HTMLElement, customElements, requestAnimationFrame, history } = window;

class Component extends TemplateLite(GetQueryMixin(ChiPublicationMixin(PropertiesLite(HTMLElement)))) {
  static get is () { return 'chi-publication'; }

  static get properties () {
    return {
      showInformation: {
        type: Boolean,
        value: false,
        observer: '_showInfo'
      },
      sessionId: {
        type: String
      },
      _baseUrl: {
        type: String,
        value: window.systemLocation || '/'
      },
      hidden: {
        type: Boolean,
        value: false,
        reflect: true
      },
      showVideo: {
        type: Boolean,
        value: false
      }
    };
  }

  static get renderer () { return render; }

  template () {
    return html`<style>${style.toString()}</style>${template(html, this)}`;
  }

  static get observers () {
    return [
      '_checkParams(params, sessionId, publicationId, publication)',
      '_showPublication(publication)'
    ];
  }

  constructor () {
    super();
    this._boundShowPublication = this._showPublication.bind(this);
  }

  connectedCallback () {
    super.connectedCallback();
    window.addEventListener('chi-update-query', this._boundShowPublication);
  }

  disconnectedCallback () {
    super.connectedCallback();
    window.removeEventListener('chi-update-query', this._boundShowPublication);
  }

  _isEqual (a, b) { return a === b; }

  _isOr (a, b) { return a || b; }

  _hideAbstract () {
    this.showInformation = false;
  }

  _showAbstract () {
    this.showInformation = true;
  }

  _toggleAbstract () {
    this.showInformation = !this.showInformation;
  }

  _showInfo () {
    if (this.showInformation && this.params.publicationId) {
      requestAnimationFrame(() => {
        this.shadowRoot.querySelector(`.invi-anchor-pub-${this.publicationId}`)
          .scrollIntoView(true);
      });
    }
  }

  _showPublication () {
    if (store.showPublications && store.showPublications.length === 0) {
      this.hidden = false;
    } else if (store.showPublications && store.showPublications.indexOf(this.publicationId) < 0) {
      this.hidden = true;
    } else {
      this.hidden = false;
    }
    // console.log(this.hidden, this.publicationId)
  }

  _checkParams (params, sessionId, publicationId, publication) {
    if (sessionId && publicationId && publication && publicationId === this.params.publicationId) {
      this._showAbstract();
    }
  }

  copyLink () {
    const copyText = document.createElement('input');
    const { location: { protocol, host, pathname } } = window;
    copyText.value = `${protocol}//${host}${pathname}?sessionId=${encodeURI(this.sessionId)}&publicationId=${encodeURI(this.publicationId)}`;
    copyText.style.display = 'inline';
    copyText.style.position = 'fixed';
    copyText.style.opacity = 0;
    this.shadowRoot.appendChild(copyText);
    copyText.select();
    document.execCommand('copy');
    this.shadowRoot.removeChild(copyText);
    // console.log('copied');
    if (this.publication) {
      toastr.info(`Copied Publication link: "${this.publication.title}" to the clipboard`);
      history.pushState({}, '', `?sessionId=${encodeURI(this.sessionId)}&publicationId=${encodeURI(this.publicationId)}`);
    }
  }

  openVideo () {
    if (window.innerWidth <= 650) {
      return window.open(`https://${this.publication.youtubeUrl}`, '_blank');
    }
    this.showVideo = true;
    this.shadowRoot.querySelector('#publication-video').show();
  }

  closeVideo () {
    this.showVideo = false;
    this.shadowRoot.querySelector('#publication-video').close();
  }
}

if (!customElements.get(Component.is)) {
  customElements.define(Component.is, Component);
} else {
  console.warn(`${Component.is} is already defined somewhere. Please check your code.`);
}
