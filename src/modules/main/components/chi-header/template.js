const template = (html, self) => function () {
  const {
    _baseUrl,
    params,
    scheduleArray,
    filteredSearch,
    filteredVenues,
    venues,
    defaultFilteredSearch,
    openNavigation,
    closeNavigation,
    _onChangeQuery,
    showClear,
    search,
    clear,
    filter,
    _ifTheresAll,
    _checkIfFiltered,
    _returnSearch,
    _returnVenues,
    _slugifyClass,
    toggleSearchFilter,
    toggleVenueFilter,
    _checkSearchFiltered,
    getSearch,
    getVenue
  } = this;

  return html`
    <header class="container">
      <nav class="navigation on-top">
        <ul class="desktop nav-list">
          <li class="phone list-item">
            <button type="button" class="nav-button menu" @click="${openNavigation.bind(this)}">
              <svg class="icon">
                <title>Open Navigation</title>
                <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
              </svg>
            </button>
            <button type="button" class="nav-button close hidden" @click="${closeNavigation.bind(this)}">
              <svg class="icon">
                <title>Close Navigation</title>
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </button>
          </li>


          ${scheduleArray && scheduleArray.length ? scheduleArray.map(item => html`
            <li class="schedule list-item">
              <a class="anchor" href="?scheduleId=${item.$key}&search=${params.search}">
                [[item.dayString]]
              </a>
            </li>
          `) : ''}
          <!--  -->

          <!-- <li class="schedule list-item">
            <a class="anchor" href="?maps=true">
              Venue Maps
            </a>
          </li> -->

          <li class="search-item list-item">
            <form on-submit="formSearch">
              <div class="input-container search-container">

                <input class="search" name="search" @keyup="${_onChangeQuery.bind(this)}" @change="${_onChangeQuery.bind(this)}">
                <button class="search-button" type="button" @click="${search.bind(this)}">Search</button>

                ${showClear(params && params.search, filteredSearch, filteredVenues) ? html`
                  <button class="search-button" type="button" @click="${clear.bind(this)}">Clear</button>
                ` : ''}

                <button class="search-button" type="button" @click="${filter.bind(this)}">Filter</button>

                <button class="search-button-icon" type="button" @click="${search.bind(this)}">
                  <svg class="icon">
                    <title>Search</title>
                    <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                  </svg>
                </button>

                ${showClear(params && params.search, filteredSearch, filteredVenues) ? html`
                  <button class="search-button-icon" type="button" @click="${clear.bind(this)}">
                    <svg class="icon">
                      <title>Clear</title>
                      <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                    </svg>
                  </button>
                ` : ''}

                <button class="search-button-icon" type="button" @click="${filter.bind(this)}">
                  <svg class="icon">
                    <title>Filter</title>
                    <path d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z" />
                  </svg>
                </button>
              </div>
            </form>
          </li>
        </ul>

        ${!_ifTheresAll(filteredSearch) ? html`
          <div class="center-container small-font">
            Search is being filtered by: ${_returnSearch(filteredSearch)}
          </div>
        ` : ''}

        ${!_ifTheresAll(filteredVenues) ? html`
          <div class="center-container small-font">
            Showing only: ${_returnVenues(filteredVenues)}
          </div>
        ` : ''}
      </nav>

      <nav class="navigation fixed-phone">
        <ul class="container nav-list-2">
          ${scheduleArray && scheduleArray.length ? scheduleArray.map(item => html`
            <li class="schedule-phone list-item">
              <a class="anchor" href="?scheduleId=${item.$key}&search=${params && params.search}">
                ${item.dayString}
              </a>
            </li>
          `) : ''}

          <!-- <li class="schedule-phone list-item">
            <a class="anchor" href="?maps=true">
              Venue Maps
            </a>
          </li> -->
        </ul>
      </nav>
    </header>

    <div class="filter-container">
      <div class="filter-content">
        <h3 class="filter-title">Filter Search</h3>
        <p>
          Use this to filter search results.
        </p>
        <form class="filter-form">
          <div class="filter-grid">
            <div class="checkbox-container">
              <label>
                <input type="checkbox" value="all" name="filter" @change="${toggleSearchFilter.bind(this)}" ?checked="${_checkSearchFiltered('all', filteredSearch)}">
                All
              </label>
            </div>
            ${defaultFilteredSearch && defaultFilteredSearch.length ? defaultFilteredSearch.map(item => html`
              <div class="checkbox-container">
                <label>
                  <input type="checkbox" value="${item}" name="filter" @change="${toggleSearchFilter.bind(this)}" ?checked="${_checkSearchFiltered(item, filteredSearch)}">
                  ${getSearch(item)}
                </label>
              </div>
            `) : ''}

          </div>
        </form>

        <h3 class="filter-title">Show Venues</h3>
        <p>
          Use this to show only particular venues.
        </p>
        <form class="filter-form">
          <div class="filter-grid">
            <div class="checkbox-container">
              <label >
                <input type="checkbox" value="all" name="filter" @change="${toggleVenueFilter.bind(this)}" ?checked="${_checkIfFiltered('all', filteredVenues)}">
                <img class="venue-icon" src="${_baseUrl}assets/all_black.svg">All
              </label>
            </div>
            ${venues && venues.length ? venues.map(item => html`
              <div class="checkbox-container">
                <label>
                  <input type="checkbox" value="${item}" name="filter" @change="${toggleVenueFilter.bind(this)}" ?checked="${_checkIfFiltered(item, filteredVenues)}">
                  <img class="venue-icon" src="${_baseUrl}assets/${_slugifyClass(item)}_black.svg"> ${getVenue(item)}
                </label>
              </div>
            `) : ''}
          </div>

          <div style="height: 50px"></div>
        </form>
      </div>
      <div class="filter-bottom-area">
        <button class="filter-button" type="button" @click="${filter.bind(this)}">Apply & Close</button>
      </div>
    </div>
  `;
}.bind(self)();

export { template };
