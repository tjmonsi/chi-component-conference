import { TemplateLite } from '@tjmonsi/element-lite/mixins/template-lite.js';
import { template } from './template.js';
import style from './style.styl';
const { HTMLElement, customElements } = window;

class Component extends TemplateLite(HTMLElement) {
  static get is () { return 'snackbar-lite'; }

  constructor () {
    super();
    this.auto = true;
    this.timeout = 5000;
    this.__timeoutCaller = null;
  }

  template () {
    return `<style>${style.toString()}</style>${template()}`;
  }

  show () {
    const snackbar = this.shadowRoot.querySelector('.snackbar');
    if (this.__timeoutCaller) {
      clearTimeout(this.__timeoutCaller);
      this.__timeoutCaller = null;
      snackbar.classList.remove('show');
    }
    snackbar.classList.remove('close');
    snackbar.classList.add('show');
    if (this.auto) {
      this.__timeoutCaller = setTimeout(() => {
        this.__timeoutCaller = null;
        this.close();
      }, this.timeout);
    }
  }

  showText (text, timeout) {
    this.auto = true;
    this.textContent = text;
    this.timeout = timeout || 5000;
    this.show();
  }

  close () {
    const snackbar = this.shadowRoot.querySelector('.snackbar');
    snackbar.classList.add('close');
    setTimeout(() => {
      snackbar.classList.remove('show');
      snackbar.classList.remove('close');
    }, 500);
  }
}

if (!customElements.get(Component.is)) {
  customElements.define(Component.is, Component);
} else {
  console.warn(`${Component.is} is already defined somewhere. Please check your code.`);
}
