/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
function getAllProperties(obj) {
  let lastPrototype = Object.getPrototypeOf(obj);
  let allPropertiesAndGetters = [];

  while (lastPrototype.constructor !== Object) {
    const getters = Object.keys(Object.getOwnPropertyDescriptors(lastPrototype));
    getters.splice(getters.indexOf('constructor'), 1);
    allPropertiesAndGetters = [...allPropertiesAndGetters, ...getters];
    lastPrototype = Object.getPrototypeOf(lastPrototype);
  }

  return [...Object.keys(Object.getOwnPropertyDescriptors(obj)), ...allPropertiesAndGetters];
}

function hasProperty(obj, property) {
  const properties = getAllProperties(obj);
  return properties.includes(property);
}

function hasOwnProperty(obj, property) {
  return Object.prototype.hasOwnProperty.call(obj, property);
}

function isObject(element) {
  return typeof element === 'object'
  && !Array.isArray(element)
  && element !== null;
}

function getValue(path, obj) {
  if (!path) {
    return obj;
  }

  return path.split('.').reduce((previous, property) => previous && previous[property], obj);
}

function clearProperty(propertiesToBeDeleted, obj) {
  for (const propertyToBeDeleted of propertiesToBeDeleted) {
    delete obj[propertyToBeDeleted];
  }
}

function setProperty(path, obj, value, join = false) {
  if (!path) {
    return obj;
  }

  const splitPath = path.split('.');
  const splitPathLength = splitPath.length;
  const property = splitPath[0];

  if (splitPathLength !== 1) {
    if (typeof obj[property] === 'undefined') {
      obj[property] = {};
    }
    splitPath.shift();
    const newPath = splitPath.join('.');
    setProperty(newPath, obj[property], value, join);
  } else if (typeof obj[property] === 'object' && typeof value === 'object' && join) {
    obj[property] = { ...obj[property], ...value };
  } else {
    obj[property] = value;
  }

  return obj;
}

function getAllPaths(obj, result = [], path = []) {
  for (const key of Object.keys(obj)) {
    if (isObject(obj[key])) {
      path.push(key);
      result.push(path.join('.'));
      getAllPaths(obj[key], result, path);
      path.pop();
    }
  }

  return result;
}

function extendParams(defaults, params) {
  const extendedParams = {};

  for (const param of Object.keys(defaults)) {
    if (hasProperty(params, param)) {
      if (isObject(defaults[param])) {
        extendedParams[param] = {
          ...defaults[param],
          ...params[param],
        };
      } else {
        extendedParams[param] = params[param];
      }
    } else {
      extendedParams[param] = defaults[param];
    }
  }

  for (const param of Object.keys(params)) {
    if (!hasProperty(defaults, param)) {
      extendedParams[param] = params[param];
    }
  }

  return extendedParams;
}

function normalizeEventName(name) {
  return name.charAt(0).toUpperCase() + name.substring(1).toLowerCase();
}

function normalizeModuleName(name) {
  return name.charAt(0).toLowerCase() + name.substring(1);
}

function normalizeActionName(name) {
  return name.charAt(0).toUpperCase() + name.substring(1);
}

function removeDuplicatesFromArr(arr, pathToProperty = '') {
  return arr.filter((
    itemFilter,
    indexFilter,
  ) => {
    const item = arr.find(
      (itemFind) => getValue(pathToProperty, itemFilter) === getValue(pathToProperty, itemFind),
    );
    return arr.indexOf(item) === indexFilter;
  });
}

function insert(
  container,
  position = {
    append: null,
    prepand: null,
    after: null,
    before: null,
  },
) {
  if (!container) {
    return;
  }

  let DOMObject;

  if (typeof position.append !== 'undefined') {
    DOMObject = typeof position.append === 'object' ? position.append : document.querySelector(position.append);
    DOMObject.append(container);
  } else if (typeof position.prepend !== 'undefined') {
    DOMObject = typeof position.prepend === 'object' ? position.prepend : document.querySelector(position.prepend);
    DOMObject.prepend(container);
  } else if (typeof position.after !== 'undefined') {
    DOMObject = typeof position.after === 'object' ? position.after : document.querySelector(position.after);
    DOMObject.after(container);
  } else if (typeof position.before !== 'undefined') {
    DOMObject = typeof position.before === 'object' ? position.before : document.querySelector(position.before);
    DOMObject.before(container);
  }
}

function templateParser(template) {
  if (template instanceof Map) {
    for (const entry of template) {
      if (isObject(entry[0])) {
        insert(entry[0], entry[1].position);
      } else if (typeof entry[0] === 'string') {
        const element = entry[1].func();
        if (typeof element.container !== 'undefined') {
          insert(element.container, entry[1].position);
        } else {
          insert(element, entry[1].position);
        }
      }
    }
  }
}

function clearContainers(containers) {
  for (let container of containers) {
    container = typeof container === 'object' ? container : document.querySelector(container);
    container.innerHTML = '';
  }
}

function isEmpty(value) {
  let newVal = value;
  if (typeof value === 'string') {
    newVal = value.trim();
  }
  return !newVal;
}

function isElementInDom(element) {
  if (typeof element === 'undefined') {
    return false;
  }
  return element.parentNode;
}

export {
  hasProperty,
  hasOwnProperty,
  isObject,
  getValue,
  setProperty,
  clearProperty,
  extendParams,
  normalizeEventName,
  normalizeModuleName,
  normalizeActionName,
  removeDuplicatesFromArr,
  insert,
  templateParser,
  getAllPaths,
  clearContainers,
  isEmpty,
  isElementInDom,
};
