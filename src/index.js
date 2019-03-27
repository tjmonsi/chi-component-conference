import './modules/main/components/chi-conference-component';
import { updateState } from './utils/state.js';
import { defaultFilteredSearch } from './utils/default-filtered-search';

// import './modules/general/components/snackbar-lite/index.js';
updateState('filtered-venues', ['all']);
updateState('venues', []);
updateState('filtered-search', [ ...defaultFilteredSearch, 'all' ]);
// throw new Error();
