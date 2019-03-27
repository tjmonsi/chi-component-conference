import { dedupingMixin } from '@tjmonsi/element-lite/lib/deduping-mixin.js';
import { ComponentWrapperMixin } from '../component-wrapper-mixin';

export const EventWrapperMixin = dedupingMixin(base => {
  class EventWrapperMixin extends /** @type {HTMLElement} */ ComponentWrapperMixin(base) {
    constructor () {
      super();
      this._childEvents = {};
    }

    addChildEventListener (eventName, fn) {
      const components = this.getComponents();
      for (let el of components) {
        if (el) {
          el.addEventListener(eventName, fn);
        }
      }
      if (!this._childEvents[eventName]) {
        this._childEvents[eventName] = [];
      }
      if (this._childEvents[eventName].indexOf(fn) < 0) {
        this._childEvents[eventName].push(fn);
      }
    }

    removeChildEventListener (eventName, fn, doNotRemove) {
      const components = this.getComponents();
      for (let el of components) {
        if (el) {
          el.removeEventListener(eventName, fn);
        }
      }
      if (!doNotRemove) {
        const index = this._childEvents[eventName].indexOf(fn);
        if (index >= 0) {
          this._childEvents[eventName].splice(index, 1);
        }
      }
    }

    removeAllChildEventListeners () {
      for (let eventName in this._childEvents) {
        const fns = this._childEvents[eventName];
        for (let fn of fns) {
          this.removeChildEventListener(eventName, fn, true);
        }
        this._childEvents[eventName] = [];
      }
    }
  }

  return EventWrapperMixin;
});
