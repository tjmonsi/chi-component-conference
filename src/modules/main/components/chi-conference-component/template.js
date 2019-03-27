const template = (html, self) => function () {
  const {
    // double-bind
    room,
    maps,
    searching,
    hitsNumber,
    search,
    showFilterWarning,
    searchResultTypes,
    // single-bind
    schedule,
    _baseUrl,
    queryChanged,
    queryObjectChanged,
    propChanged
  } = this;

  return html`
    <!-- <> -->
    <location-lite @query-change=${queryChanged.bind(this)}></location-lite>
    <query-lite @query-object-change=${queryObjectChanged.bind(this)}></query-lite>

    <chi-header class="on-top"></chi-header>
    <chi-header class="fixed"></chi-header>

    <!-- all are double-bind -->
    <chi-search
      .maps="${maps}"
      @maps-change=${propChanged.bind(this, 'maps')}
      .room="${room}"
      @room-change=${propChanged.bind(this, 'room')}
      .showFilterWarning="${showFilterWarning}"
      @show-filter-warning-change=${propChanged.bind(this, 'showFilterWarning')}
      .searching="${searching}"
      @searching-change=${propChanged.bind(this, 'searching')}
      .hitsNumber="${hitsNumber}"
      @hits-number-change=${propChanged.bind(this, 'hitsNumber')}
      .search="${search}"
      @search-change="${propChanged.bind(this, 'search')}"
      .searchResultTypes="${searchResultTypes}"
      @search-result-types-change="${propChanged.bind(this, 'searchResultTypes')}"></chi-search>

    <section class="container">

      ${searching ? html`
        <div class="searching">
          <img class="loader" src="${_baseUrl}assets/loader.gif"><br/>
          Searching...
        </div>
      ` : ''}

      ${!showFilterWarning ? html`
        ${search ? html`
          ${!searching ? html`
            ${hitsNumber ? html`
              <div class="center-container">
                <p>
                  Your search term "<b>${search}</b>" has returned <b>${hitsNumber}</b> result(s).
                  <ul>
                    ${searchResultTypes && searchResultTypes.author ? html`
                      <li>
                        ${searchResultTypes.author} Author(s)
                        <ul>
                          ${searchResultTypes.displayNameList && searchResultTypes.displayNameList.length ? searchResultTypes.displayNameList.map(displayName => html`
                            <li>
                              ${displayName.displayName}: ${displayName.publications.length} Paper(s)
                            </li>
                          `) : ''}
                        </ul>
                      </li>
                    ` : ''}

                    ${searchResultTypes && searchResultTypes.primaryInstitution ? html`
                      <li>
                        ${searchResultTypes.primaryInstitution} Primary Institution(s)
                        <ul>
                          ${searchResultTypes.primaryInstitutionList && searchResultTypes.primaryInstitutionList.length ? searchResultTypes.primaryInstitutionList.map(primaryInstitution => html`
                            <li>
                              ${primaryInstitution.institution}: ${primaryInstitution.publications.length} Paper(s)
                            </li>
                          `) : ''}
                        </ul>
                      </li>
                    ` : ''}

                    ${searchResultTypes && searchResultTypes.secondaryInstitution ? html`
                      <li>
                        ${searchResultTypes.secondaryInstitution} Secondary Institution(s)
                        <ul>
                          ${searchResultTypes.secondaryInstitutionList && searchResultTypes.secondaryInstitutionList.length ? searchResultTypes.secondaryInstitutionList.map(secondaryInstitution => html`
                            <li>
                              ${secondaryInstitution.institution}: ${secondaryInstitution.publications.length} Paper(s)
                            </li>
                          `) : ''}
                        </ul>
                      </li>
                    ` : ''}

                    ${searchResultTypes && searchResultTypes.publications ? html`
                      <li>${searchResultTypes.publication} Paper(s)</li>
                    ` : ''}

                    ${searchResultTypes && searchResultTypes.session ? html`
                      <li>${searchResultTypes.session} Session(s)</li>
                    ` : ''}
                  </ul>
                </p>
              </div>
            ` : html`
              <div class="center-container">
                <p>
                  Your search term "<b>${search}</b>" has returned <b>${hitsNumber}</b> results. Please choose another term.
                </p>
              </div>
            `}
          ` : ''}
        ` : ''}
      ` : html`
        <div class="center-container">
          <p>
            Your search term "<b>${search}</b>" has returned <b>${hitsNumber}</b> results. <br>
            To improve performance, query results will not show up on the schedule.
            <ul>
              ${searchResultTypes ? html`
                ${searchResultTypes.author ? html`
                  <li>${searchResultTypes.author} Author(s)</li>
                ` : ''}

                ${searchResultTypes.primaryInstitution ? html`
                  <li>${searchResultTypes.primaryInstitution} Primary Institution(s)</li>
                ` : ''}

                ${searchResultTypes.secondaryInstitution ? html`
                  <li>${searchResultTypes.secondaryInstitution} Secondary Institution(s)</li>
                ` : ''}

                ${searchResultTypes.publication ? html`
                  <li>${searchResultTypes.publication} Paper(s)</li>
                ` : ''}

                ${searchResultTypes.session ? html`
                  <li>${searchResultTypes.session} Session(s)</li>
                ` : ''}
              ` : ''}
            </ul>
          </p>
          <p>
            Please use more specific search terms or use the "Filter Search" above to narrow down results.
          </p>
        </div>
      `}

      ${!maps ? html`
        ${schedule && schedule.length ? schedule.map((item, index) => html`
          <chi-day class="chi-day-item" .day="${item}" .scheduleIndex="${index}"></chi-day>
        `) : ''}
      ` : html`
        <!-- add maps here -->
      `}

      <div style="height: 300px"></div>

      <footer class="footer">
        <a class="github-link" href="https://github.com/tjmonsi/chi-conference-component/issues" target="_blank" rel="noopener">
          Suggestions or bug reports.
        </a>
      </footer>
    </section>
  `;
}.bind(self)();

export { template };

/**
 *
 *
      <template is="dom-if" if="[[!maps]]">
        <template is="dom-repeat" items="[[schedule]]">
          <chi-day class="chi-day-item" day="[[item]]" schedule-index="[[index]]"></chi-day>
        </template>
      </template>

      <template is="dom-if" if="[[maps]]">
        <section class="maps-container">
          <h2>Level 5</h2>
          <img class="level-5 map" src="[[_baseUrl]]assets/level-5.svg">
          <h2>Level 2</h2>
          <img class="level-2 map" src="[[_baseUrl]]assets/level-2.svg">
          <h2>Exhibit Hall on Monday</h2>
          <img class="exhibit-mon map" src="[[_baseUrl]]assets/exhibit-hall-mon.svg">
          <h2>Exhibit Hall on Tuesday</h2>
          <img class="exhibit-tue map"src="[[_baseUrl]]assets/exhibit-hall-tue.svg">
          <h2>Societe Des Arts Technologique</h2>
          <div class="mapouter la-sat">
            <div class="gmap_canvas">
              <iframe width="600" height="500" id="gmap_canvas" src="https://maps.google.com/maps?q=Societe Des Arts Technologique&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
            </div>
            <a href="https://www.embedgooglemap.net">embedgooglemap.net</a>
          </div>
        </section>
      </template>
 */
