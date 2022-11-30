/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/extensions */

import { defaults } from './defaults.js';
import {
  extendParams,
  hasProperty,
  normalizeActionName,
  normalizeModuleName,
} from '../commonFunctions/index.js';
import { Form } from '../form/index.js';

const modulesToBeInstalled = {
};

class SiteSearch {
  constructor(parentElement = '.site-search', params = {}) {
    const siteSearch = this;

    siteSearch.extendedParams = extendParams(defaults, params);

    siteSearch.parentElement = typeof parentElement === 'object' ? parentElement : document.querySelector(parentElement);
    siteSearch.modules = {};
    siteSearch.actions = {};
    siteSearch.onActionCallbacks = {};

    siteSearch.setSearchForm();
    siteSearch.setControlButtons();
    siteSearch.instalAllModules();
    siteSearch.setDelegation();

    document.addEventListener('click', siteSearch.documentHandler.bind(siteSearch));

    siteSearch
      .attachAction(
        {
          delegationId: 'siteSearchToggleButton',
          eventType: 'click',
          actionName: 'toggleSearchForm',
          func: siteSearch.toggleSearchForm.bind(siteSearch),
        },
      )
      .attachAction(
        {
          delegationId: 'siteSearchCloseButton',
          eventType: 'click',
          actionName: 'toggleSearchForm',
          func: siteSearch.toggleSearchForm.bind(siteSearch),
        },
      );
  }

  setElement(elementName, selectors) {
    const siteSearch = this;

    if (selectors) {
      siteSearch[elementName] = siteSearch.parentElement.querySelector(
        selectors,
      );
    } else {
      siteSearch[elementName] = null;
    }
  }

  setSearchForm() {
    const siteSearch = this;

    siteSearch.searchForm = new Form(siteSearch.extendedParams.searchForm.selectors);

    siteSearch.searchForm.form.addEventListener('submit', (event) => event.preventDefault());
  }

  setControlButtons() {
    const siteSearch = this;

    const {
      extendedParams,
    } = siteSearch;

    siteSearch.setElement('toggleButton', extendedParams.toggleButton.selectors);
    siteSearch.setElement('searchButton', extendedParams.searchButton.selectors);
    siteSearch.setElement('closeButton', extendedParams.closeButton.selectors);

    siteSearch.toggleButton.setAttribute('data-delegation-id', 'siteSearchToggleButton');

    if (siteSearch.closeButton) {
      siteSearch.closeButton.setAttribute('data-delegation-id', 'siteSearchCloseButton');
    }
  }

  setDelegation() {
    const siteSearch = this;

    siteSearch.parentElement.addEventListener('click', siteSearch.onClick.bind(siteSearch));
  }

  onClick(event) {
    const siteSearch = this;
    const {
      delegationId,
    } = event.target.dataset;
    if (hasProperty(siteSearch.actions, delegationId)) {
      if (hasProperty(siteSearch.actions[delegationId], 'click')) {
        for (const func of Object.values(siteSearch.actions[delegationId].click)) {
          func(event);
        }
      }
    }
  }

  attachAction({
    delegationId,
    eventType,
    actionName,
    func,
  }) {
    const siteSearch = this;

    if (!hasProperty(siteSearch, 'actions')) {
      siteSearch.actions = {};
    }

    if (!hasProperty(siteSearch.actions, delegationId)) {
      siteSearch.actions[delegationId] = {};
    }

    if (!hasProperty(siteSearch.actions[delegationId], eventType)) {
      siteSearch.actions[delegationId][eventType] = {};
    }

    siteSearch.actions[delegationId][eventType][actionName] = func;

    return siteSearch;
  }

  onAction(actionName, callback) {
    const siteSearch = this;

    const normalizedActionName = normalizeActionName(actionName);

    siteSearch.onActionCallbacks[`on${normalizedActionName}`] = callback;

    return siteSearch;
  }

  instalAllModules() {
    const siteSearch = this;

    let prepareModulesForInstallation = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const item of Object.values(modulesToBeInstalled)) {
      prepareModulesForInstallation = { ...prepareModulesForInstallation, ...item };
    }

    siteSearch.use(prepareModulesForInstallation);
  }

  use(modules) {
    const siteSearch = this;

    const modulesKeys = Object.keys(modules);

    if (modulesKeys.length === 0) {
      return;
    }

    siteSearch.modules = { ...siteSearch.modules, ...modules };

    // eslint-disable-next-line no-restricted-syntax
    for (const key of modulesKeys) {
      const siteSearchKey = normalizeModuleName(key);
      if (hasProperty(siteSearch.extendedParams, siteSearchKey)) {
        siteSearch[siteSearchKey] = new modules[key](
          siteSearch,
          siteSearch.extendedParams[siteSearchKey],
        );
      } else {
        siteSearch[siteSearchKey] = new modules[key](siteSearch);
      }
    }

    // eslint-disable-next-line consistent-return
    return siteSearch;
  }

  toggleSearchForm() {
    const siteSearch = this;

    const { extendedParams } = siteSearch;

    siteSearch.searchForm.form.classList.toggle(
      extendedParams.searchForm.hiddenClass,
    );

    if (extendedParams.toggleButton.addActiveClass) {
      siteSearch.toggleButton.classList.toggle(
        extendedParams.toggleButton.activeClass,
      );
    }
  }

  documentHandler(event) {
    const siteSearch = this;

    const { target } = event;

    if (!siteSearch.parentElement.contains(target)
      && !siteSearch.searchForm.form.classList.contains(
        siteSearch.extendedParams.searchForm.hiddenClass,
      )
    ) {
      siteSearch.toggleSearchForm();
    }
  }
}

export { SiteSearch };
