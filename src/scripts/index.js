/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */

import { Burger } from './library.blocks/burger/index.js';
import { SiteSearch } from './library.blocks/siteSearch/index.js';
import { Form, Validate } from './library.blocks/form/index.js';
import { YandexMap } from './library.blocks/yandexMap/index.js';
import { Popover } from './library.blocks/popover/index.js';

const burger = new Burger();
const siteSearch = new SiteSearch();
const subscribeForm = new Form('form[name="subscriptionForm"]', {
  validate: {
    defaultsClasses: {
      messageClass: ['form__validation-message'],
      errorClass: ['form__validation-message_type_error'],
      invalidFieldClass: ['input_view_invalid'],
    },
  },
});
const requestForm = new Form('form[name="requestForm"]', {
  validate: {
    defaultsClasses: {
      messageClass: ['form__validation-message'],
      errorClass: ['form__validation-message_type_error'],
      invalidFieldClass: ['input_view_invalid'],
    },
  },
});
const mapPopover = new Popover('.map__popover', {
  popoverBodyCloseButton: {
    selectors: '.map__popover-close-button',
  },

  body: {
    selectors: '.map__popover',
    hiddenClass: 'map__popover_hidden',
  },
});
const yandexMap = new YandexMap('.yandex-map', {
  controlsToBeDeleted: [
    'zoomControl',
    'geolocationControl',
    'trafficControl',
    'typeSelector',
    'fullscreenControl',
    'rulerControl',
    'inputSearch',
    'searchControl',
  ],
  placemarks: [
    {
      coordinates: [55.769486, 37.638373],
      properties: {
        hintContent: 'Студия «High pass»',
      },
      options: {
        openBalloonOnClick: false,
        iconLayout: 'default#image',
        iconImageHref: '/images/raster/icons/my-placemark.svg',
        iconImageSize: [12, 12],
      },
      onClick: mapPopover.openPopover.bind(mapPopover),
    },
  ],

  lazyLoad: {
    on: true,
    loadingUsingIntersectionObserver: {
      on: true,
      options: {
        root: null,
        threshold: 0,
      },
      target: '.contacts',
    },
  },
});

const ruleRequired = {
  value: 'required',
  errorMessage: 'Поле необходимо заполнить!',
};
const EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const NAME_REGEXP = /^[а-яА-Я]+?[а-яА-Я\s-]*$/;

subscribeForm.use({ Validate });
subscribeForm.validate
  .addField('email', [
    ruleRequired,
    {
      validator(elemValue) {
        return elemValue.match(EMAIL_REGEXP);
      },
      errorMessage: 'Недопустимый формат',
    },
  ]);
subscribeForm.validate
  .onSuccess(() => subscribeForm.form.submit(), 'submit');

requestForm.use({ Validate });
requestForm.validate
  .addField('name', [
    ruleRequired,
    {
      validator(elemValue) {
        return elemValue.match(NAME_REGEXP);
      },
      errorMessage: 'Недопустимый формат',
    },
  ])
  .addField('email', [
    ruleRequired,
    {
      validator(elemValue) {
        return elemValue.match(EMAIL_REGEXP);
      },
      errorMessage: 'Недопустимый формат',
    },
  ]);
requestForm.validate
  .onSuccess(() => requestForm.form.submit(), 'submit');
