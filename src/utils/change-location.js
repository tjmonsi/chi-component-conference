export const changeLocation = location => {
  window.history.pushState({}, '', location);
  window.dispatchEvent(new window.CustomEvent('location-change'));
};
