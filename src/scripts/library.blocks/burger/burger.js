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

const modulesToBeInstalled = {
};

class Burger {
  constructor(parentElement = '.burger', params = {}) {
    const burger = this;

    burger.extendedParams = extendParams(defaults, params);

    burger.parentElement = typeof parentElement === 'object' ? parentElement : document.querySelector(parentElement);
    burger.modules = {};
    burger.actions = {};
    burger.onActionCallbacks = {};

    burger.setBody();
    burger.setNav();
    burger.setControlButtons();
    burger.instalAllModules();
    burger.setDelegation();

    document.addEventListener('click', burger.documentHandler.bind(burger));

    burger
      .attachAction(
        {
          delegationId: 'burgerToggleButton',
          eventType: 'click',
          actionName: 'toggleBurger',
          func: burger.toggleBurger.bind(burger),
        },
      )
      .attachAction(
        {
          delegationId: 'burgerNavLink',
          eventType: 'click',
          actionName: 'toggleBurger',
          func: burger.toggleBurger.bind(burger),
        },
      );

    burger.parentElement.addEventListener(
      'transitionend',
      burger.setWidthForNavLinkBefore.bind(burger),
    );
  }

  setControlButtons() {
    const burger = this;

    const {
      parentElement,
      extendedParams,
    } = burger;

    burger.burgerToggleButton = parentElement.querySelector(
      extendedParams.burgerToggleButton.selectors,
    );

    burger.burgerBodyToggleButton = burger.body.querySelector(
      extendedParams.burgerBodyToggleButton.selectors,
    );

    burger.burgerToggleButton.setAttribute('data-delegation-id', 'burgerToggleButton');
    burger.burgerBodyToggleButton.setAttribute('data-delegation-id', 'burgerToggleButton');
  }

  setBody() {
    const burger = this;

    const {
      parentElement,
      extendedParams,
    } = burger;

    burger.body = parentElement.querySelector(
      extendedParams.body.selectors,
    );
  }

  setNav() {
    const burger = this;

    const {
      parentElement,
      extendedParams,
    } = burger;

    burger.nav = parentElement.querySelector(
      extendedParams.nav.selectors,
    );
    burger.navMenu = parentElement.querySelector(
      extendedParams.navMenu.selectors,
    );
    burger.navLinks = parentElement.querySelectorAll(
      extendedParams.navLinks.selectors,
    );

    for (const navLink of burger.navLinks) {
      navLink.setAttribute('data-delegation-id', 'burgerNavLink');
    }
  }

  setDelegation() {
    const burger = this;

    burger.parentElement.addEventListener('click', burger.onClick.bind(burger));
  }

  onClick(event) {
    const burger = this;
    const {
      delegationId,
    } = event.target.dataset;
    if (hasProperty(burger.actions, delegationId)) {
      if (hasProperty(burger.actions[delegationId], 'click')) {
        for (const func of Object.values(burger.actions[delegationId].click)) {
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
    const burger = this;

    if (!hasProperty(burger, 'actions')) {
      burger.actions = {};
    }

    if (!hasProperty(burger.actions, delegationId)) {
      burger.actions[delegationId] = {};
    }

    if (!hasProperty(burger.actions[delegationId], eventType)) {
      burger.actions[delegationId][eventType] = {};
    }

    burger.actions[delegationId][eventType][actionName] = func;

    return burger;
  }

  onAction(actionName, callback) {
    const burger = this;

    const normalizedActionName = normalizeActionName(actionName);

    burger.onActionCallbacks[`on${normalizedActionName}`] = callback;

    return burger;
  }

  instalAllModules() {
    const burger = this;

    let prepareModulesForInstallation = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const item of Object.values(modulesToBeInstalled)) {
      prepareModulesForInstallation = { ...prepareModulesForInstallation, ...item };
    }

    burger.use(prepareModulesForInstallation);
  }

  use(modules) {
    const burger = this;

    const modulesKeys = Object.keys(modules);

    if (modulesKeys.length === 0) {
      return;
    }

    burger.modules = { ...burger.modules, ...modules };

    // eslint-disable-next-line no-restricted-syntax
    for (const key of modulesKeys) {
      const burgerKey = normalizeModuleName(key);
      if (hasProperty(burger.extendedParams, burgerKey)) {
        burger[burgerKey] = new modules[key](
          burger,
          burger.extendedParams[burgerKey],
        );
      } else {
        burger[burgerKey] = new modules[key](burger);
      }
    }

    // eslint-disable-next-line consistent-return
    return burger;
  }

  toggleBurger() {
    const burger = this;

    const { extendedParams } = burger;

    burger.body.classList.toggle(extendedParams.body.hiddenClass);

    if (extendedParams.burgerToggleButton.addActiveClass) {
      burger.burgerToggleButton.classList.toggle(extendedParams.burgerToggleButton.activeClass);
    }

    if (extendedParams.burgerBodyToggleButton.addActiveClass) {
      burger.burgerBodyToggleButton.classList.toggle(
        extendedParams.burgerBodyToggleButton.activeClass,
      );
    }

    if (document.body.style.overflowY === '') {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = '';
    }
  }

  documentHandler(event) {
    const burger = this;

    const { extendedParams } = burger;
    const { target } = event;

    if (!burger.parentElement.contains(target)
      && !burger.body.classList.contains(extendedParams.body.hiddenClass)
    ) {
      burger.toggleBurger();
    }
  }

  setWidthForNavLinkBefore(event) {
    const burger = this;

    if (event.propertyName === 'width') {
      for (const navLink of burger.navLinks) {
        navLink.style.setProperty('--burger__nav-link-before-width', `${burger.navMenu.clientWidth - 1}px`);
      }
    }
  }
}

export { Burger };
