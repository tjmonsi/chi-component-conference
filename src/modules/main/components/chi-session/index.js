import { TemplateLite } from '@tjmonsi/element-lite/mixins/template-lite.js';
import { ObserversLite } from '@tjmonsi/element-lite/mixins/observers-lite.js';
import { store } from '../chi-store';
import { GetQueryMixin } from '../../mixins/get-query-mixin';
import { render, html } from 'lit-html';
import { template } from './template.js';
import style from './style.styl';
import { toastr } from '../toastr-component';
import '../marked-element';
import '../dialog-box';
import '../chi-publication';
import '../chi-room';

const { HTMLElement, customElements, requestAnimationFrame, history, CustomEvent } = window;

class Component extends TemplateLite(GetQueryMixin(ObserversLite(HTMLElement))) {
  static get is () { return 'chi-session'; }

  static get properties () {
    return {
      dayString: {
        type: String
      },
      dateString: {
        type: String
      },
      timeString: {
        type: String
      },
      timeslotRealId: {
        type: String
      },
      sessionId: {
        type: String,
        observer: '_sessionIdChange'
      },
      session: {
        type: Object,
        observer: '_sessionChange'
      },
      showPublications: {
        type: Boolean,
        value: false,
        reflect: true,
        observer: '_showPub'
      },
      forceShowPublications: {
        type: Boolean,
        value: false,
        reflect: true
      },
      forceClose: {
        type: Boolean,
        value: false,
        reflect: true
      },
      index: {
        type: Number,
        value: 0
      },
      hidden: {
        type: Boolean,
        value: false,
        reflect: true
      },
      _baseUrl: {
        type: String,
        value: window.systemLocation || '/'
      },
      room: {
        type: String
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
      '_checkParams(params, sessionId, session)'
    ];
  }

  constructor () {
    super();
    this._boundSessionUpdate = this._sessionIdChange.bind(this);
    this._boundShowSession = this._showSession.bind(this);
    this._boundCloseSession = this._closeSession.bind(this);
  }

  connectedCallback () {
    super.connectedCallback();
    window.addEventListener('chi-update-session', this._boundSessionUpdate);
    window.addEventListener('chi-update-query', this._boundSessionUpdate);
    this.addEventListener('click', this._boundShowSession);
  }

  disconnectedCallback () {
    super.disconnectedCallback();
    window.removeEventListener('chi-update-session', this._boundSessionUpdate);
    window.removeEventListener('chi-update-query', this._boundSessionUpdate);
    this.removeEventListener('click', this._boundShowSession);
  }

  _sessionIdChange () {
    const sessionId = this.sessionId;
    if (store.session[sessionId]) {
      this.session = store.session[sessionId];
      this.hidden = store.session[sessionId].hidden;
      this.forceShowPublications = store.session[sessionId].expand;
      // console.log(!!store.search && store.session[sessionId].expand)
      // this.showPublications = !!store.search && store.session[sessionId].expand;
    }
  }

  _showPub () {
    if (this.showPublications && this.params.sessionId === this.sessionId && !this.params.publicationId) {
      requestAnimationFrame(() => {
        this.shadowRoot.querySelector(`.invi-anchor-session-${this.sessionId}`)
          .scrollIntoView({
            behavior: 'auto',
            block: 'start'
          });
      });
    }
  }

  _sessionChange (session) {
    if (session && session.publications) {
      const keys = Object.keys(session.publications);
      const publications = [];
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        const obj = { ...session.publications[key], $key: key };
        publications.push(obj);
      }
      publications.sort((i, j) => (i.value - j.value));
      this.publications = publications;
    }
  }

  _showPublicationClass (showPublications) {
    return showPublications ? 'show-publications' : '';
  }

  _cleanText (title, trim) {
    const text = title && title.replace(/&nbsp;/, ' ').replace(/&amp;/, '&');
    return text.length > trim ? (text.split(' ').reduce((prev, next) => prev.length >= trim ? prev : prev + ' ' + next).replace(/:$/, '') + '...') : text;
  }

  _slugifyClass (venue) { return venue.toLowerCase().replace(/ /, '-'); }

  _setClass (venue) { if (venue) this.classList.add(this._slugifyClass(venue)); }

  _showSession () {
    if (!this.showPublications && !this.forceClose && !this.forceShowPublications) {
      this.dispatchEvent(new CustomEvent('open-duplicate'));
    } else if (this.forceClose) {
      this.dispatchEvent(new CustomEvent('close-duplicate'));
    }
  }

  _closeSession (e) {
    e.stopPropagation();
    e.preventDefault();
    if (!store.session[this.sessionId].expand) this.dispatchEvent(new CustomEvent('close-duplicate'));
  }

  _checkParams (params, sessionId, session) {
    if (sessionId && session && params.sessionId === this.sessionId) {
      this._showSession();
      // setTimeout(() => {
      //   history.pushState({}, '', `?`);
      //   dispatchEvent(new CustomEvent('location-change'));
      // }, 5000);
    }
  }

  _openPublications (showPublications, forceShowPublications) {
    return showPublications || forceShowPublications;
  }

  getVenueTitle (venue) {
    if (venue) {
      switch (venue.toLowerCase()) {
        case 'altchi':
          return 'alt.chi';
        case 'casestudy':
          return 'Case Study';
        case 'docconsortium':
          return '';
        case 'science jam':
          return '';
        case 'demo':
          return '';
        case 'workshop':
          return '';
        case 'game jam':
          return '';
        case 'symposia':
          return '';
        case 'keynote':
          return '';
        case 'paper':
          return 'Paper Session';
        case 'sig':
          return 'SIG';
        case 'competition':
          return '';
        case 'awards':
          return '';
        case 'videoshowcase':
          return '';
        case 'art':
          return 'Art';
        case 'break':
          return '';
        case 'lbw':
          return 'Late-breaking Work';
        case 'panel':
          return 'Panel/Roundtable';
        default:
          return venue.charAt(0).toUpperCase() + venue.slice(1);
      }
    }
  }

  _getDateTime (dayString, dateString, time) {
    return `${dayString}, ${dateString} - ${time.split('-')[0]}`;
  }

  copyLink () {
    const copyText = document.createElement('input');
    const { location: { protocol, host, pathname } } = window;
    copyText.value = `${protocol}//${host}${pathname}?sessionId=${encodeURI(this.sessionId)}`;
    copyText.style.display = 'inline';
    copyText.style.position = 'fixed';
    copyText.style.opacity = 0;
    this.shadowRoot.appendChild(copyText);
    copyText.select();
    document.execCommand('copy');
    this.shadowRoot.removeChild(copyText);
    console.log('copied');
    toastr.info(`Copied Session link: "${this.session.title}" to the clipboard`);
    history.pushState({}, '', `?sessionId=${encodeURI(this.sessionId)}`);
  }

  openVideo () {
    if (window.innerWidth <= 650) {
      return window.open(`https://chi2018.acm.org/attending/stream/?timeslot=${this.timeslotRealId}&room=${this.session.roomName}`, '_blank');
      // return window.open(`https://${this.publication.youtubeUrl}`, '_blank');
    }
    this.shadowRoot.querySelector('#session-video').show();
    this.showVideo = true;
  }

  closeVideo () {
    this.shadowRoot.querySelector('#session-video').close();
    this.showVideo = false;
  }
}

if (!customElements.get(Component.is)) {
  customElements.define(Component.is, Component);
} else {
  console.warn(`${Component.is} is already defined somewhere. Please check your code.`);
}
