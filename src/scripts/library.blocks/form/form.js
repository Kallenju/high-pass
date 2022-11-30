/* eslint-disable import/extensions */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */

import { defaults } from './defaults.js';
import { extendParams } from '../commonFunctions/index.js';

class Form {
  constructor(parentElement, params = {}) {
    const form = this;

    form.form = typeof parentElement === 'object' ? parentElement : document.querySelector(parentElement);

    form.extendedParams = extendParams(defaults, params);

    form.eventHandlers = new Map();
  }

  addListener(type, elem, handler, handlerName) {
    const form = this;

    form.eventHandlers.set(handlerName, handler);

    elem.addEventListener(type, handler);

    return form;
  }

  removeListener(type, elem, handlerName) {
    const form = this;

    elem.removeEventListener(type, form.eventHandlers.get(handlerName));

    form.eventHandlers.delete(handlerName);

    return form;
  }

  getListenerType(type) {
    switch (type) {
      case 'checkbox':
      case 'select-one':
      case 'file':
      case 'radio': {
        return 'change';
      }
      default: {
        return 'input';
      }
    }
  }

  setListenerOnField(elem, handler, handlerName) {
    const form = this;

    const type = form.getListenerType(elem.type);

    if (elem.type === 'fieldset') {
      return;
    }

    form.addListener(type, elem, handler, handlerName);
  }

  getElemValue(elem) {
    switch (elem.type) {
      case 'checkbox':
        return elem.checked;
      case 'file':
        return elem.files;
      default:
        return elem.value;
    }
  }

  use(modules) {
    const form = this;

    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(modules)) {
      const formKey = key.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(form.extendedParams, formKey)) {
        form[formKey] = new modules[key](form, form.extendedParams[formKey]);
      } else {
        form[formKey] = new modules[key](form);
      }
    }
  }
}

export { Form };
