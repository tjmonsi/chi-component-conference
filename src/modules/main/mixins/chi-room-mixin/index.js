import { dedupingMixin } from '@tjmonsi/element-lite/lib/deduping-mixin.js';
import { PropertiesLite } from '@tjmonsi/element-lite/mixins/properties-lite.js';
import { ErrorMixin } from '../../../general/mixins/error-mixin';
import { firebase } from '../../components/firebase-obj';
const collection = 'room';
const version = 'v1';

export const ChiRoomMixin = dedupingMixin(base => {
  class ChiRoomMixin extends /** @type {HTMLElement} */ PropertiesLite(ErrorMixin(base)) {
    static get properties () {
      return {
        room: {
          type: Object
        },
        roomId: {
          type: String,
          observer: '_getRoom'
        }
      };
    }

    constructor () {
      super();
      this._boundSetRoom = this._setRoom.bind(this);
    }

    disconnectedCallback () {
      if (super.disconnectedCallback) super.disconnectedCallback();
      this._closeRoom();
    }

    async _getRoom (roomId) {
      if (roomId) {
        this._closeRoom();
        this._roomRef = firebase.database().ref(`${version}/${collection}-model/${collection}/${roomId}`);
        this._roomRef.on('value', this._boundSetRoom);
      }
    }

    _closeRoom () {
      if (this._roomRef) this._roomRef.off('value', this._boundSetRoom);
    }

    _setRoom (snapshot) {
      this.room = snapshot.val();
    }
  }

  return ChiRoomMixin;
});
