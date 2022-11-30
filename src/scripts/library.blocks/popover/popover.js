/* eslint-disable class-methods-use-this */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */

import { defaults } from './defaults.js';
import {
  extendParams,
  hasProperty,
  normalizeActionName,
  normalizeModuleName,
} from '../commonFunctions/index.js';

const modulesToBeInstalled = {
};

class Popover {
  constructor(parentElement = '.popover', params = {}) {
    const popover = this;

    popover.extendedParams = extendParams(defaults, params);
    popover.parentElement = typeof parentElement === 'object' ? parentElement : document.querySelector(parentElement);

    popover.modules = {};
    popover.actions = {};
    popover.onActionCallbacks = {};

    popover.setBody();
    popover.setControlButtons();
    popover.instalAllModules();
    popover.setDelegation();

    popover
      .attachAction(
        {
          delegationId: 'popoverBodyCloseButton',
          eventType: 'click',
          actionName: 'closePopover',
          func: popover.closePopover.bind(popover),
        },
      );
  }

  setControlButtons() {
    const popover = this;

    const {
      parentElement,
      extendedParams,
    } = popover;

    popover.popoverBodyCloseButton = parentElement.querySelector(
      extendedParams.popoverBodyCloseButton.selectors,
    );

    popover.popoverBodyCloseButton.setAttribute('data-delegation-id', 'popoverBodyCloseButton');
  }

  setBody() {
    const popover = this;

    const {
      extendedParams,
    } = popover;

    popover.body = document.body.querySelector(
      extendedParams.body.selectors,
    );
  }

  closePopover() {
    const popover = this;

    const { extendedParams } = popover;

    popover.body.classList.add(extendedParams.body.hiddenClass);
  }

  openPopover() {
    const popover = this;

    const { extendedParams } = popover;

    popover.body.classList.remove(extendedParams.body.hiddenClass);
  }

  setDelegation() {
    const popover = this;

    popover.parentElement.addEventListener('click', popover.onClick.bind(popover));
  }

  onClick(event) {
    const popover = this;
    const {
      delegationId,
    } = event.target.dataset;
    if (hasProperty(popover.actions, delegationId)) {
      if (hasProperty(popover.actions[delegationId], 'click')) {
        for (const func of Object.values(popover.actions[delegationId].click)) {
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
    const popover = this;

    if (!hasProperty(popover, 'actions')) {
      popover.actions = {};
    }

    if (!hasProperty(popover.actions, delegationId)) {
      popover.actions[delegationId] = {};
    }

    if (!hasProperty(popover.actions[delegationId], eventType)) {
      popover.actions[delegationId][eventType] = {};
    }

    popover.actions[delegationId][eventType][actionName] = func;

    return popover;
  }

  onAction(actionName, callback) {
    const popover = this;

    const normalizedActionName = normalizeActionName(actionName);

    popover.onActionCallbacks[`on${normalizedActionName}`] = callback;

    return popover;
  }

  instalAllModules() {
    const popover = this;

    let prepareModulesForInstallation = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const item of Object.values(modulesToBeInstalled)) {
      prepareModulesForInstallation = { ...prepareModulesForInstallation, ...item };
    }

    popover.use(prepareModulesForInstallation);
  }

  use(modules) {
    const popover = this;

    const modulesKeys = Object.keys(modules);

    if (modulesKeys.length === 0) {
      return;
    }

    popover.modules = { ...popover.modules, ...modules };

    // eslint-disable-next-line no-restricted-syntax
    for (const key of modulesKeys) {
      const popoverKey = normalizeModuleName(key);
      if (hasProperty(popover.extendedParams, popoverKey)) {
        popover[popoverKey] = new modules[key](
          popover,
          popover.extendedParams[popoverKey],
        );
      } else {
        popover[popoverKey] = new modules[key](popover);
      }
    }

    // eslint-disable-next-line consistent-return
    return popover;
  }
}

export { Popover };
