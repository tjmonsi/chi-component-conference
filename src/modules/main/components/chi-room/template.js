const template = (html, self) => function () {
  const {
    room
  } = this;

  return html`
    ${room && room.room ? html`
      <a class="anchor">Room: ${room.room}</a>
    ` : ''}
  `;
}.bind(self)();

export { template };

/**
 * <dialog-box id="map-box-level-5" class="map-box">
      <template is="dom-if" if="[[levelFiveMap]]" restamp >
        <button type="button" class="dialog-button" on-click="closeMap">
          <svg class="icon">
            <title>Close Map</title>
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </button>
        <img class="map" src="[[_baseUrl]]assets/level-5.svg">
      </template>
    </dialog-box>

    <dialog-box id="map-box-level-2" class="map-box">
      <template is="dom-if" if="[[levelTwoMap]]" restamp >
        <button type="button" class="dialog-button" on-click="closeMap">
          <svg class="icon">
            <title>Close Map</title>
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </button>
        <img class="map" src="[[_baseUrl]]assets/level-2.svg">
      </template>
    </dialog-box>

    <dialog-box id="map-box-sat" class="map-box">
      <template is="dom-if" if="[[satMap]]" restamp >
        <button type="button" class="dialog-button" on-click="closeMap">
          <svg class="icon">
            <title>Close Map</title>
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </button>
        <div class="mapouter la-sat">
          <div class="gmap_canvas">
            <iframe width="600" height="500" id="gmap_canvas" src="https://maps.google.com/maps?q=Societe Des Arts Technologique&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
          </div>
          <a href="https://www.embedgooglemap.net">embedgooglemap.net</a>
        </div>
      </template>
    </dialog-box>

    <dialog-box id="map-box-exhibit" class="map-box">
      <template is="dom-if" if="[[exhibits]]" restamp >
        <button type="button" class="dialog-button" on-click="closeMap">
          <svg class="icon">
            <title>Close Map</title>
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </button>
        <h2>Exhibit Hall on Monday</h2>
        <img class="exhibit-mon map" src="[[_baseUrl]]assets/exhibit-hall-mon.svg">
        <h2>Exhibit Hall on Tuesday</h2>
        <img class="exhibit-tue map"src="[[_baseUrl]]assets/exhibit-hall-tue.svg">
      </template>
    </dialog-box>

    <dialog-box id="map-box-exhibit-monday" class="map-box">
      <template is="dom-if" if="[[exhibitMonday]]" restamp >
        <button type="button" class="dialog-button" on-click="closeMap">
          <svg class="icon">
            <title>Close Map</title>
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </button>
        <h2>Exhibit Hall on Monday</h2>
        <img class="exhibit-mon map" src="[[_baseUrl]]assets/exhibit-hall-mon.svg">
      </template>
    </dialog-box>

    <dialog-box id="map-box-exhibit-tuesday" class="map-box">
      <template is="dom-if" if="[[exhibitTuesday]]" restamp >
        <button type="button" class="dialog-button" on-click="closeMap">
          <svg class="icon">
            <title>Close Map</title>
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </button>
        <h2>Exhibit Hall on Tuesday</h2>
        <img class="exhibit-mon map" src="[[_baseUrl]]assets/exhibit-hall-tue.svg">
      </template>
    </dialog-box>
 */
