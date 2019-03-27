import { dedupingMixin } from '@tjmonsi/element-lite/lib/deduping-mixin.js';
const { fetch } = window;

export const FetchMixin = dedupingMixin(base => {
  class FetchMixin extends /** @type {HTMLElement} */base {
    fetch (url, { method, body, headers: headerObj }) {
      const headers = window.Headers ? new window.Headers() : headerObj;

      if (window.Headers) {
        for (let key in headerObj) {
          headers.set(key, headerObj[key]);
        }
      }

      const options = {
        method,
        body,
        headers
      };

      return fetch(url, options);
    }

    getFetch (url, body, headers) {
      return this.fetch(url, { method: 'GET', body, headers });
    }

    postFetch (url, body, headers) {
      return this.fetch(url, { method: 'POST', body, headers });
    }
  }

  return FetchMixin;
});
