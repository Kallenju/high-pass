/* eslint-disable import/prefer-default-export */

const defaults = {
  center: [55.771505, 37.632313],
  zoom: 14,
  controlsToBeDeleted: [],
  placemarks: [],

  lazyLoad: {
    on: false,

    scriptSrc: 'https://api-maps.yandex.ru/2.1/?apikey=YourAPIkey&lang=ru_RU&load=Map,Placemark',

    staticMap: {
      selectors: '.yandex-map__static-img-container',
    },

    loadingUsingIntersectionObserver: {
      on: true,
      options: {
        root: null,
        threshold: 0,
      },
      target: '.yandex-map',
    },
  },
};

export { defaults };
