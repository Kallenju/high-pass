/* eslint-disable class-methods-use-this */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */

import { defaults } from './defaults.js';
import { extendParams } from '../commonFunctions/index.js';

class YandexMap {
  constructor(parentElement = '.yandex-map', params = {}) {
    const yandexMap = this;

    yandexMap.extendedParams = extendParams(defaults, params);
    yandexMap.parentElement = typeof parentElement === 'object' ? parentElement : document.querySelector(parentElement);

    yandexMap.myMap = null;
    yandexMap.mapLoaded = false;

    if (yandexMap.extendedParams.lazyLoad.on) {
      yandexMap.lazyLoad();
    } else {
      yandexMap.createMap();
    }
  }

  createMap() {
    const yandexMap = this;

    const { extendedParams } = yandexMap;

    window.ymaps.ready(() => {
      yandexMap.myMap = new window.ymaps.Map(yandexMap.parentElement, {
        center: extendedParams.center,
        zoom: extendedParams.zoom,
      });

      yandexMap.deleteControls();

      yandexMap.addMyPlacemarks(
        yandexMap.createPlacemarksArr(extendedParams.placemarks),
      );

      yandexMap.mapLoaded = true;
    });
  }

  deleteControls() {
    const yandexMap = this;

    for (const control of yandexMap.extendedParams.controlsToBeDeleted) {
      yandexMap.myMap.controls.remove(control);
    }
  }

  createMyPlacemark({
    coordinates,
    properties,
    options,
    onClick = null,
  }) {
    const myPlacemark = new window.ymaps.Placemark(coordinates, properties, options);

    if (onClick) {
      myPlacemark.events.add('click', onClick);
    }

    return myPlacemark;
  }

  createPlacemarksArr(placemarksParams) {
    const yandexMap = this;

    yandexMap.placemarksArr = [];

    for (const placemarkParams of placemarksParams) {
      yandexMap.placemarksArr.push(yandexMap.createMyPlacemark(placemarkParams));
    }

    return yandexMap.placemarksArr;
  }

  addMyPlacemarks(placemarkArr) {
    const yandexMap = this;

    for (const placemark of placemarkArr) {
      yandexMap.myMap.geoObjects.add(placemark);
    }
  }

  lazyLoad() {
    const yandexMap = this;

    const lazyLoadParams = yandexMap.extendedParams.lazyLoad;

    function lazyLoadCallback() {
      yandexMap.loadScript().then(() => {
        yandexMap.deleteStaticMap();
        yandexMap.createMap();
      });
    }

    if (lazyLoadParams.loadingUsingIntersectionObserver.on) {
      yandexMap.loadingUsingIntersectionObserver(lazyLoadCallback);
    }
  }

  loadScript() {
    const yandexMap = this;

    const lazyLoadParams = yandexMap.extendedParams.lazyLoad;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');

      script.src = lazyLoadParams.scriptSrc;

      document.head.append(script);

      script.onload = () => resolve(script);
      script.onerror = () => reject(new Error(`Ошибка загрузки скрипта ${lazyLoadParams.scriptSrc}`));
    });
  }

  deleteStaticMap() {
    const yandexMap = this;

    const staticMapParams = yandexMap.extendedParams.lazyLoad.staticMap;

    if (staticMapParams.selectors) {
      const staticMap = document.querySelector(staticMapParams.selectors);
      if (staticMap) {
        staticMap.remove();
      }
    }
  }

  loadingUsingIntersectionObserver(callback) {
    const yandexMap = this;

    const params = yandexMap.extendedParams.lazyLoad.loadingUsingIntersectionObserver;
    const target = document.querySelector(params.target);

    const observer = new IntersectionObserver((entries) => {
      if (!yandexMap.mapLoaded) {
        if (entries[0].intersectionRatio > 0) {
          callback();
          observer.disconnect();
        }
      }
    }, params.options);

    observer.observe(target);
  }
}

export { YandexMap };
