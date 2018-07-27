/* global DHIS_CONFIG, manifest */

import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import log from "loglevel";
import { config, getUserSettings, init } from "d2/lib/d2";
import App from "./app";
import registerServiceWorker from "./registerServiceWorker";
import store from "./store";
// import i18n from "./locales";

/**
 * @module index
 */

/**
 * Sets baseUrl, schemas and sources on the d2 config object and then initializes d2
 * @function
 */
const setupD2 = () => {
  const isProd = process.env.NODE_ENV === "production";
  const apiVersion = manifest.dhis2.apiVersion || "29";
  const baseUrl = !isProd ? DHIS_CONFIG.baseUrl : manifest.activities.dhis.href;

  config.baseUrl = `${baseUrl}/api/${apiVersion}`;
  config.schemas = [
    "userRole",
    "user",
    "userGroup",
    "userCredentials",
    "organisationUnit",
    "categoryOptionGroupSet"
  ];

  return (
    getUserSettings()
      // .then(configI18n)
      .then(init)
  );
};

/**
 * Adds translation sources to the d2 config object for deprecated translation methods used by d2-ui
 * And sets language for new i18n module from "@dhis2/d2-i18n"
 * @param {Object} userSettings - user settings object returned by the d2 getUserSettings promise
 * @function
 */
// const configI18n = userSettings => {
//   const uiLocale = userSettings.keyUiLocale;
//   const sources = config.i18n.sources;
//   // Using the old style of translations for the d2-ui components
//   if (uiLocale !== "en") {
//     sources.add(`i18n/i18n_module_${uiLocale}.properties`);
//   }
//   sources.add("i18n/i18n_module_en.properties");
//   i18n.changeLanguage(uiLocale);
//   return config;
// };

const renderAppInDOM = d2 => {
  render(
    <Provider store={store}>
      <App d2={d2} />
    </Provider>,
    document.getElementById("root")
  );
};

setupD2()
  .then(renderAppInDOM)
  .then(registerServiceWorker)
  .catch(log.error.bind(log));
