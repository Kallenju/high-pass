import{defaults}from"./defaults.js";import{extendParams,hasProperty,normalizeActionName,normalizeModuleName}from"../commonFunctions/index.js";const modulesToBeInstalled={};class Burger{constructor(e=".burger",t={}){var o=this;o.extendedParams=extendParams(defaults,t),o.parentElement="object"==typeof e?e:document.querySelector(e),o.modules={},o.actions={},o.onActionCallbacks={},o.setBody(),o.setNav(),o.setControlButtons(),o.instalAllModules(),o.setDelegation(),document.addEventListener("click",o.documentHandler.bind(o)),o.attachAction({delegationId:"burgerToggleButton",eventType:"click",actionName:"toggleBurger",func:o.toggleBurger.bind(o)}).attachAction({delegationId:"burgerNavLink",eventType:"click",actionName:"toggleBurger",func:o.toggleBurger.bind(o)}),o.parentElement.addEventListener("transitionend",o.setWidthForNavLinkBefore.bind(o))}setControlButtons(){var e=this;const{parentElement:t,extendedParams:o}=e;e.burgerToggleButton=t.querySelector(o.burgerToggleButton.selectors),e.burgerBodyToggleButton=e.body.querySelector(o.burgerBodyToggleButton.selectors),e.burgerToggleButton.setAttribute("data-delegation-id","burgerToggleButton"),e.burgerBodyToggleButton.setAttribute("data-delegation-id","burgerToggleButton")}setBody(){const{parentElement:e,extendedParams:t}=this;this.body=e.querySelector(t.body.selectors)}setNav(){var e=this;const{parentElement:t,extendedParams:o}=e;e.nav=t.querySelector(o.nav.selectors),e.navMenu=t.querySelector(o.navMenu.selectors),e.navLinks=t.querySelectorAll(o.navLinks.selectors);for(const n of e.navLinks)n.setAttribute("data-delegation-id","burgerNavLink")}setDelegation(){var e=this;e.parentElement.addEventListener("click",e.onClick.bind(e))}onClick(e){var t=this,o=e.target.dataset["delegationId"];if(hasProperty(t.actions,o)&&hasProperty(t.actions[o],"click"))for(const n of Object.values(t.actions[o].click))n(e)}attachAction({delegationId:e,eventType:t,actionName:o,func:n}){var r=this;return hasProperty(r,"actions")||(r.actions={}),hasProperty(r.actions,e)||(r.actions[e]={}),hasProperty(r.actions[e],t)||(r.actions[e][t]={}),r.actions[e][t][o]=n,r}onAction(e,t){e=normalizeActionName(e);return this.onActionCallbacks["on"+e]=t,this}instalAllModules(){let e={};for(const t of Object.values(modulesToBeInstalled))e={...e,...t};this.use(e)}use(e){var t=this,o=Object.keys(e);if(0!==o.length){t.modules={...t.modules,...e};for(const r of o){var n=normalizeModuleName(r);hasProperty(t.extendedParams,n)?t[n]=new e[r](t,t.extendedParams[n]):t[n]=new e[r](t)}return t}}toggleBurger(){var e=this,t=e["extendedParams"];e.body.classList.toggle(t.body.hiddenClass),t.burgerToggleButton.addActiveClass&&e.burgerToggleButton.classList.toggle(t.burgerToggleButton.activeClass),t.burgerBodyToggleButton.addActiveClass&&e.burgerBodyToggleButton.classList.toggle(t.burgerBodyToggleButton.activeClass),""===document.body.style.overflowY?document.body.style.overflowY="hidden":document.body.style.overflowY=""}documentHandler(e){var t=this,o=t["extendedParams"],e=e["target"];t.parentElement.contains(e)||t.body.classList.contains(o.body.hiddenClass)||t.toggleBurger()}setWidthForNavLinkBefore(e){if("width"===e.propertyName)for(const t of this.navLinks)t.style.setProperty("--burger__nav-link-before-width",this.navMenu.clientWidth-1+"px")}}export{Burger};